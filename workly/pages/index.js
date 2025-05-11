import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCheck, Clock, Search, ShieldCheck } from "lucide-react";
import Link from "next/link"

export default function Home({ categories, currentYear }) {

  return (
    <>
      <section className="relative bg-gradient-to-br from-pro-dark via-pro to-pro-light text-white">
        <div className="container-custom py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 md:pr-10">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Find Skilled Pros for Any Task
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Connect with qualified service providers in your area. Post a job or offer your skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-white text-pro hover:bg-gray-200">
                    Get Started
                  </Button>
                </Link>
                <Link href="/help">
                  <Button size="lg" variant="outline" className="border-white text-pro hover:bg-white/10">
                    How it Works
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-end">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-6 -left-6 w-40 h-40 bg-pro-accent/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-blue-400/20 rounded-full blur-3xl"></div>
                <div className="relative bg-white p-6 rounded-xl shadow-xl">
                  <div className="space-y-6">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-pro">
                        <Search size={20} />
                      </div>
                      <div>
                        <h3 className="text-gray-800 font-medium">Find Help</h3>
                        <p className="text-sm text-gray-500">Post your task, get offers</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <CheckCheck size={20} />
                      </div>
                      <div>
                        <h3 className="text-gray-800 font-medium">Choose a Pro</h3>
                        <p className="text-sm text-gray-500">Browse ratings & reviews</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <Clock size={20} />
                      </div>
                      <div>
                        <h3 className="text-gray-800 font-medium">Get it Done</h3>
                        <p className="text-sm text-gray-500">Complete tasks efficiently</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Service Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse through our most requested service categories or post your specific task needs
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/task-listing?category=${category.name}`}
                className="flex flex-col items-center p-6 rounded-lg border border-gray-100 hover:border-pro/30 hover:shadow-md transition-all bg-white"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-medium text-gray-800">{category.name}</h3>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/tasks">
              <Button variant="outline" className="border-pro text-pro hover:bg-pro hover:text-white">
                View All Categories <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Workly Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to connect service providers with people who need their skills
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pro text-white flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Post your task</h3>
                  <p className="text-gray-600">Describe what you need done, when you need it, and what your budget is.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pro text-white flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Receive bids</h3>
                  <p className="text-gray-600">Qualified professionals will send you competitive bids for your task.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pro text-white flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Choose and complete</h3>
                  <p className="text-gray-600">Select the best pro for your needs, and confirm when the task is done.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
              <div className="relative aspect-video overflow-hidden rounded-md bg-gray-100 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1581093588401-fbb62a02f120?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Professional at work"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-medium">Trustworthy Professionals</h3>
                <p className="text-gray-600">
                  All service providers on our platform are vetted for quality and reliability. Browse ratings and reviews to find the perfect match for your job.
                </p>
                <div className="flex items-center gap-3">
                  <ShieldCheck size={24} className="text-pro" />
                  <span className="text-gray-700 font-medium">Satisfaction Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Workly</h3>
              <p className="text-gray-300 text-sm">
                The platform connecting skilled professionals with people who need their services.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">For Clients</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/task-listing" className="hover:text-white">Browse Tasks</Link></li>
                <li><Link href="/post-task" className="hover:text-white">Post a Task</Link></li>
                <li><Link href="/help" className="hover:text-white">How it Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">For Professionals</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/task-listing" className="hover:text-white">Find Work</Link></li>
                <li><Link href="/profile" className="hover:text-white">Build Your Profile</Link></li>
                <li><Link href="/help" className="hover:text-white">Success Tips</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
            <p>© {currentYear} Workly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export async function getStaticProps() {
  const categories = [
    { name: "Plumbing", icon: "🔧" },
    { name: "Electrical", icon: "⚡" },
    { name: "Carpentry", icon: "🔨" },
    { name: "Painting", icon: "🖌️" },
    { name: "Cleaning", icon: "🧹" },
    { name: "Moving", icon: "📦" },
    { name: "Gardening", icon: "🌱" },
    { name: "Driving", icon: "🚗" }
  ];

  const currentYear = new Date().getFullYear();

  return {
    props: {
      categories,
      currentYear
    }
  }
}