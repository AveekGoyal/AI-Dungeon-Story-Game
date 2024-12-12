"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { medievalSharp } from "@/lib/typography"

export function CTASection() {
  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className={cn(
            "text-4xl md:text-5xl font-bold mb-6 text-white",
            medievalSharp.className
          )}>
            Ready to Write Your Story?
          </h2>
          <p className="text-lg text-gray-300 mb-12">
            Join thousands of players in creating unique adventures that challenge your imagination and creativity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Button
                size="lg"
                className={cn(
                  "bg-red-700 hover:bg-red-800 text-white text-lg px-8 py-6 shadow-lg shadow-red-900/50",
                  medievalSharp.className
                )}
                asChild
              >
                <Link href="/sign-in">
                  Begin Your Adventure
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}