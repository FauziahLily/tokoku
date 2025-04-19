import './globals.css';


export const metadata = {
  title: 'Tokoku',
  description: 'Tokoku - Your Online Store',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
