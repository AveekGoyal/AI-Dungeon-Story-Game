"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView, useSpring, useTransform, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Alex Thompson",
    role: "Adventure Enthusiast",
    content: "The most immersive storytelling experience I've ever had. Each adventure feels unique and personal.",
    rating: 5
  },
  {
    name: "Sarah Chen",
    role: "Fantasy Writer",
    content: "As a writer myself, I'm amazed by the depth and creativity of the stories. The AI adapts perfectly to my choices.",
    rating: 5
  },
  {
    name: "Michael Rodriguez",
    role: "RPG Gamer",
    content: "Finally, an AI game that truly understands narrative. The character development is incredible!",
    rating: 5
  },
  {
    name: "Emily Parker",
    role: "Digital Artist",
    content: "The storytelling is so rich and vivid, it's like being inside a living, breathing world.",
    rating: 5
  }
]

const stats = [
  { label: "Adventures Created", value: 10000, suffix: "+" },
  { label: "Active Players", value: 5000, suffix: "+" },
  { label: "Unique Stories", value: 50000, suffix: "+" },
  { label: "Average Rating", value: 4.9, suffix: "/5" }
]

function AnimatedNumber({ value, suffix }: { value: number, suffix: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const spring = useSpring(0, { duration: 2000 })
  const displayValue = useTransform(spring, (latest) => {
    if (value >= 1000) {
      return `${Math.floor(latest).toLocaleString()}`
    }
    return latest.toFixed(1)
  })

  useEffect(() => {
    if (inView) {
      spring.set(value)
    }
  }, [inView, spring, value])

  return (
    <span ref={ref} className="inline-block">
      {inView ? <motion.span>{displayValue}</motion.span> : "0"}
      {suffix}
    </span>
  )
}

export function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-24 bg-black text-white">
      <div className="container px-4 mx-auto">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <h3 className="text-3xl font-bold mb-2 text-white">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </h3>
              <p className="text-gray-300">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-lg mb-6 text-gray-300">
                    "{testimonials[currentTestimonial].content}"
                  </p>
                  <div>
                    <p className="text-xl font-bold mb-1 text-white">
                      {testimonials[currentTestimonial].name}
                    </p>
                    <p className="text-gray-400">
                      {testimonials[currentTestimonial].role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Testimonial Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? "w-8 bg-white" : "w-2 bg-gray-600"
                }`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}