// layout.tsx

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body >
                {children}
            </body>
        </html>
    )
}
