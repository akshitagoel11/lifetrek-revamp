import Link from "next/link"
import { Mountain, Github, Twitter, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="flex items-center space-x-2">
            <Mountain className="h-5 w-5" />
            <span className="font-bold">LIFETREK</span>
          </Link>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} LifeTrek. All rights reserved.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <nav className="flex items-center space-x-1">
            <Link
              href="#"
              target="_blank"
              rel="noreferrer"
              className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="#"
              target="_blank"
              rel="noreferrer"
              className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="#"
              target="_blank"
              rel="noreferrer"
              className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="#"
              target="_blank"
              rel="noreferrer"
              className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email</span>
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
