import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I post a task?",
    answer: "To post a task, first sign in to your Workly account as an employer. Then click on the 'Post a Task' button in the navigation bar or dashboard. Fill out the task details including title, category, location, budget, and description. Click 'Post Task' to publish your listing."
  },
  {
    question: "How do I find tasks to work on?",
    answer: "If you're registered as a service provider, navigate to the 'Browse Tasks' or 'Find Work' section. You can filter tasks by category, location, and budget to find opportunities that match your skills. When you find a suitable task, click on it to view details and submit your bid."
  },
  {
    question: "How does bidding work?",
    answer: "As a service provider, you can place bids on open tasks. When bidding, you'll specify your price, estimated completion time, and a message explaining why you're the best fit for the job. The task poster will review all bids and select the professional they want to work with."
  },
  {
    question: "How do I choose a service provider for my task?",
    answer: "When you post a task, you'll receive bids from interested service providers. You can review each provider's profile, including their ratings, reviews, and previous work experience. Consider both the bid amount and the provider's qualifications to make your decision. Once you've chosen, click 'Accept Bid' on the provider's bid."
  },
  {
    question: "How does payment work?",
    answer: "Payment terms are typically agreed upon between the employer and service provider directly. We recommend discussing payment details before work begins. Some common payment methods include cash, digital transfers, or checks upon completion of the task. Always ensure both parties are clear on payment expectations."
  },
  {
    question: "What happens after a task is completed?",
    answer: "Once a service provider has completed the task, both parties should confirm completion through the platform. The employer can then leave a review rating the provider's work. This helps build the provider's reputation and assists other employers in making hiring decisions."
  }
];

const helpSections = [
  {
    title: "For Employers",
    steps: [
      {
        title: "Create an Account",
        description: "Sign up and choose 'Employer' as your role to get started."
      },
      {
        title: "Post Your Task",
        description: "Describe what you need done, set your budget, and specify your location."
      },
      {
        title: "Review Bids",
        description: "Service providers will submit bids for your task. Review their profiles and choose the best fit."
      },
      {
        title: "Confirm Completion",
        description: "After the work is complete, confirm completion and leave a review."
      }
    ]
  },
  {
    title: "For Service Providers",
    steps: [
      {
        title: "Create Your Profile",
        description: "Sign up, choose 'Service Provider' as your role, and highlight your skills and experience."
      },
      {
        title: "Find Work",
        description: "Browse available tasks that match your skills and location."
      },
      {
        title: "Submit Your Bid",
        description: "Send a competitive bid with a message explaining why you're the best person for the job."
      },
      {
        title: "Complete Tasks",
        description: "Provide quality service to build your reputation and get positive reviews."
      }
    ]
  }
];

const Help = ({ faqs, helpSections }) => {
  return (
    <>
      <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-8">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">How Workly Works</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our platform connects skilled service providers with people who need their expertise.
              Here's how to get started and make the most of Workly.
            </p>
          </div>

          {/* How it works sections */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {helpSections.map((section, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold mb-6 text-pro">{section.title}</h2>
                <div className="space-y-6">
                  {section.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pro text-white flex items-center justify-center font-bold mr-3">
                        {stepIndex + 1}
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{step.title}</h3>
                        <p className="text-gray-600 text-sm">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="bg-white rounded-lg shadow-sm border border-gray-100">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="px-6 text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
};

export default Help;

export async function getStaticProps() {
  return {
    props: {
      faqs,
      helpSections
    }
  };
}