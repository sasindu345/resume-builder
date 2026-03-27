import { Link } from 'react-router-dom'
import { FileText, Github, Twitter, Linkedin } from 'lucide-react'

const footerLinks = [
    {
        title: 'Product',
        links: [
            { label: 'Templates', to: '/templates' },
            { label: 'Resume Builder', to: '/builder' },
            { label: 'Dashboard', to: '/dashboard' },
        ],
    },
    {
        title: 'Resources',
        links: [
            { label: 'Resume Tips', to: '#' },
            { label: 'ATS Guide', to: '#' },
            { label: 'Career Blog', to: '#' },
        ],
    },
    {
        title: 'Account',
        links: [
            { label: 'Log In', to: '/login' },
            { label: 'Sign Up', to: '/register' },
        ],
    },
]

export function Footer() {
    return (
        <footer
            style={{
                background: 'var(--surface)',
                borderTop: '1px solid var(--border)',
                color: 'var(--text)',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4 group">
                            <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}
                            >
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                                ResumeBuilder
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--muted)' }}>
                            Build professional, ATS-friendly resumes for free. Powered by AI review and modern templates.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { icon: Github, href: '#', label: 'GitHub' },
                                { icon: Twitter, href: '#', label: 'Twitter' },
                                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                            ].map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                                    style={{
                                        background: 'var(--bg)',
                                        border: '1px solid var(--border)',
                                        color: 'var(--muted)',
                                    }}
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {footerLinks.map(({ title, links }) => (
                        <div key={title}>
                            <h4
                                className="text-xs font-bold uppercase tracking-widest mb-4"
                                style={{ color: 'var(--muted)' }}
                            >
                                {title}
                            </h4>
                            <ul className="space-y-2.5">
                                {links.map(({ label, to }) => (
                                    <li key={label}>
                                        <Link
                                            to={to}
                                            className="text-sm transition-colors hover:opacity-70"
                                            style={{ color: 'var(--text)' }}
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div
                style={{ borderTop: '1px solid var(--border)' }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                        © {new Date().getFullYear()} ResumeBuilder. All rights reserved.
                    </p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                        Empowering job seekers worldwide
                    </p>
                </div>
            </div>
        </footer>
    )
}
