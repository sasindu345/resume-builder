package com.sasindu.rdsumebuilder.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sasindu.rdsumebuilder.dto.request.AIReviewRequest;
import com.sasindu.rdsumebuilder.dto.response.AIReviewResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpMethod;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * AI-powered CV Review Service.
 * Uses OpenAI GPT API to analyze resumes and provide structured feedback
 * for specific domains/industries.
 */
@Service
@Slf4j
public class AIReviewService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final Environment env;

    private final Map<String, String> fileBackedEnv = new LinkedHashMap<>();

    public AIReviewService(ObjectMapper objectMapper, Environment env) {
        this.restTemplate = new RestTemplate();
        this.objectMapper = objectMapper;
        this.env = env;
        loadEnvFileValues();
    }

    private String getApiKey() {
        return getConfigValue("OPENAI_API_KEY", "ai.openai.api-key");
    }

    private String getOpenAiModel() {
        String model = getConfigValue("OPENAI_MODEL", "ai.openai.model");
        return model.isBlank() ? "gpt-4o-mini" : model;
    }

    private String getGeminiApiKey() {
        return getConfigValue("GEMINI_API_KEY", "ai.gemini.api-key");
    }

    private String getGeminiModel() {
        String model = getConfigValue("GEMINI_MODEL", "ai.gemini.model");
        return model.isBlank() ? "gemini-2.5-flash" : model;
    }

    private String getConfigValue(String envKey, String propertyKey) {
        String value = env.getProperty(envKey);
        if (value != null && !value.isBlank()) {
            return value.trim();
        }

        value = env.getProperty(propertyKey);
        if (value != null && !value.isBlank()) {
            return value.trim();
        }

        value = fileBackedEnv.get(envKey);
        if (value != null && !value.isBlank()) {
            return value.trim();
        }

        return "";
    }

    private void loadEnvFileValues() {
        List<Path> candidates = List.of(
                Path.of(".env.local"),
                Path.of(".env"),
                Path.of("resume-builder-backend/.env.local"),
                Path.of("resume-builder-backend/.env")
        );

        for (Path path : candidates) {
            if (!Files.exists(path) || !Files.isRegularFile(path)) {
                continue;
            }

            try {
                for (String line : Files.readAllLines(path)) {
                    String trimmed = line.trim();
                    if (trimmed.isEmpty() || trimmed.startsWith("#") || !trimmed.contains("=")) {
                        continue;
                    }

                    int separator = trimmed.indexOf('=');
                    String key = trimmed.substring(0, separator).trim();
                    String value = trimmed.substring(separator + 1).trim();
                    fileBackedEnv.putIfAbsent(key, stripWrappingQuotes(value));
                }
            } catch (IOException e) {
                log.warn("Failed to read env file {}: {}", path, e.getMessage());
            }
        }
    }

    private String stripWrappingQuotes(String value) {
        if (value.length() >= 2 && value.startsWith("\"") && value.endsWith("\"")) {
            return value.substring(1, value.length() - 1);
        }
        return value;
    }

    /**
     * Analyze a resume using AI and return structured feedback.
     * Attempts Gemini API first, and falls back to OpenAI API.
     * Throws an Exception if both fail or neither API key is configured.
     *
     * @param request The review request containing resume data and target domain
     * @return Structured review response
     */
    public AIReviewResponse reviewResume(AIReviewRequest request) {
        log.info("Starting AI review for domain: {}", request.getTargetDomain());

        String resumeJson;
        try {
            resumeJson = objectMapper.writeValueAsString(request.getResumeData());
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize resume data", e);
        }
        
        String prompt = buildReviewPrompt(request.getTargetDomain(), resumeJson);
        String openAiKey = getApiKey();
        String geminiKey = getGeminiApiKey();

        String geminiError = null;
        String openAiError = null;

        // 1. Try Gemini first (Primary)
        if (geminiKey != null && !geminiKey.isBlank()) {
            try {
                return callGemini(prompt, geminiKey);
            } catch (RestClientResponseException e) {
                geminiError = "HTTP " + e.getStatusCode() + " - " + e.getResponseBodyAsString();
                log.error("Gemini API Error: {}", geminiError);
            } catch (Exception e) {
                geminiError = e.getMessage();
                log.error("Gemini call failed. Error: {}", geminiError);
            }
        } else {
            geminiError = "GEMINI_API_KEY not configured. Make sure the backend loads .env/.env.local or exports the variable before startup.";
            log.warn("Gemini API key missing. Trying OpenAI fallback.");
        }

        // 2. Try OpenAI as fallback (Secondary)
        if (openAiKey != null && !openAiKey.isBlank()) {
            try {
                return callOpenAI(prompt, openAiKey);
            } catch (RestClientResponseException e) {
                openAiError = "HTTP " + e.getStatusCode() + " - " + e.getResponseBodyAsString();
                log.error("OpenAI API Error: {}", openAiError);
            } catch (Exception e) {
                openAiError = e.getMessage();
                log.error("OpenAI call failed. Error: {}", openAiError);
            }
        } else {
            openAiError = "OPENAI_API_KEY not configured.";
            log.warn("OpenAI API key missing.");
        }

        // 3. Both failed - Throw a clear exception showing why both failed
        String errorMessage = String.format("AI Review failed for both engines.\\nGemini Reason: %s\\nOpenAI Reason: %s", geminiError, openAiError);
        throw new RuntimeException(errorMessage);
    }

    private AIReviewResponse callOpenAI(String prompt, String apiKey) throws Exception {
        log.info("Calling OpenAI API...");
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        
        Map<String, Object> bodyValue = Map.of(
                "model", getOpenAiModel(),
                "messages", List.of(
                        Map.of("role", "system", "content", "You are an expert technical recruiter and resume reviewer. Always respond with valid JSON only, no markdown."),
                        Map.of("role", "user", "content", prompt)
                ),
                "response_format", Map.of("type", "json_object"),
                "temperature", 0.7
        );
        
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(bodyValue, headers);
        ResponseEntity<String> response = restTemplate.exchange(
                "https://api.openai.com/v1/chat/completions",
                HttpMethod.POST,
                requestEntity,
                String.class
        );
        
        String responseBody = response.getBody();

        return parseAIResponse(responseBody, true);
    }

    private AIReviewResponse callGemini(String prompt, String apiKey) throws Exception {
        log.info("Calling Gemini API...");

        // Gemini handles system messages a bit differently, prepending to user prompt is a safe generic pattern
        String fullPrompt = "You are an expert technical recruiter and resume reviewer. Always respond with valid JSON only, no markdown.\n\n" + prompt;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> bodyValue = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", fullPrompt)
                        ))
                ),
                "generationConfig", Map.of(
                        "responseMimeType", "application/json"
                )
        );

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(bodyValue, headers);
        String geminiModel = getGeminiModel();
        ResponseEntity<String> response = restTemplate.exchange(
                "https://generativelanguage.googleapis.com/v1beta/models/" + geminiModel + ":generateContent?key=" + apiKey,
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        String responseBody = response.getBody();

        return parseAIResponse(responseBody, false);
    }

    /**
     * Build the prompt that instructs the AI how to review the resume.
     */
    private String buildReviewPrompt(String targetDomain, String resumeJson) {
        return """
                Analyze the following resume and provide a detailed review for the %s domain.
                Return your response as a valid JSON object with this exact structure, no markdown:
                {
                  "overallScore": <number 1-10>,
                  "summary": "<brief 2-3 sentence summary>",
                  "criticalIssues": [{"title": "<issue>", "description": "<details>", "priority": "HIGH"}],
                  "improvements": [{"title": "<suggestion>", "description": "<details>", "priority": "HIGH|MEDIUM|LOW"}],
                  "strengths": [{"title": "<strength>", "description": "<details>", "priority": "HIGH|MEDIUM"}],
                  "structuralSuggestions": [{"title": "<suggestion>", "description": "<details>", "priority": "MEDIUM|LOW"}],
                  "missingKeywords": ["<keyword1>", "<keyword2>"],
                  "atsTips": ["<tip1>", "<tip2>"]
                }
                
                Resume Data:
                %s
                """.formatted(targetDomain, resumeJson);
    }

    /**
     * Parse the API response into our structured DTO.
     */
    private AIReviewResponse parseAIResponse(String responseBody, boolean isOpenAI) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        String content;
        
        if (isOpenAI) {
            JsonNode choices = root.path("choices");
            if (!choices.isArray() || choices.isEmpty()) {
                throw new RuntimeException("OpenAI returned no choices: " + responseBody);
            }
            content = choices.get(0).path("message").path("content").asText();
        } else {
            JsonNode candidates = root.path("candidates");
            if (!candidates.isArray() || candidates.isEmpty()) {
                String blockReason = root.path("promptFeedback").path("blockReason").asText();
                if (!blockReason.isBlank()) {
                    throw new RuntimeException("Gemini blocked the prompt: " + blockReason);
                }
                throw new RuntimeException("Gemini returned no candidates: " + responseBody);
            }

            JsonNode parts = candidates.get(0).path("content").path("parts");
            if (!parts.isArray() || parts.isEmpty()) {
                throw new RuntimeException("Gemini returned an empty content payload: " + responseBody);
            }

            List<String> textParts = new ArrayList<>();
            for (JsonNode part : parts) {
                String text = part.path("text").asText();
                if (!text.isBlank()) {
                    textParts.add(text);
                }
            }

            content = String.join("\n", textParts);
        }

        if (content == null || content.isBlank()) {
            throw new RuntimeException((isOpenAI ? "OpenAI" : "Gemini") + " returned blank content.");
        }

        // Clean any markdown code block markers
        content = content.replaceAll("```json\\s*", "").replaceAll("```\\s*", "").trim();

        return objectMapper.readValue(content, AIReviewResponse.class);
    }
}
