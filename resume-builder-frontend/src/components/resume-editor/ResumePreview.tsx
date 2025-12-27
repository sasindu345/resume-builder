import { ResumeData } from '@/pages/ResumeEditor';
import { motion } from 'framer-motion';
import { THEMES } from '@/types/template';
import { ModernTemplate } from '@/components/templates/ModernTemplate';
import { ClassicTemplate } from '@/components/templates/ClassicTemplate';
import { MinimalTemplate } from '@/components/templates/MinimalTemplate';
import { ProfessionalTemplate } from '@/components/templates/ProfessionalTemplate';
import { CreativeTemplate } from '@/components/templates/CreativeTemplate';

interface ResumePreviewProps {
    data: ResumeData;
}

export function ResumePreview({ data }: ResumePreviewProps) {
    const theme = THEMES[data.theme || 'blue'];

    const renderTemplate = () => {
        const templateName = data.template || 'modern';

        switch (templateName) {
            case 'modern':
                return <ModernTemplate data={data} theme={theme} />;
            case 'classic':
                return <ClassicTemplate data={data} theme={theme} />;
            case 'minimal':
                return <MinimalTemplate data={data} theme={theme} />;
            case 'professional':
                return <ProfessionalTemplate data={data} theme={theme} />;
            case 'creative':
                return <CreativeTemplate data={data} theme={theme} />;
            default:
                return <ModernTemplate data={data} theme={theme} />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full"
        >
            {renderTemplate()}
        </motion.div>
    );
}
