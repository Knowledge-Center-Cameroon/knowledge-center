import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, MapPin, Phone, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import emailjs from '@emailjs/browser';

const Contact: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "message") setMessageCount(value.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Please fill all required fields",
        description: "Name, Email and Message are required.",
      });
      return;
    }
    if (!formData.subject) {
      toast({
        title: "Select a subject",
        description: "Please choose a subject so we can route your message.",
      });
      return;
    }

    setIsSubmitting(true);

    if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
      setTimeout(() => {
        toast({
          title: "Demo: Message not actually sent",
          description: "Set VITE_EMAILJS_* keys in your .env to enable real submissions.",
        });
        setIsSubmitting(false);
      }, 600);
      return;
    }

    try {
      const res = await emailjs.send(
        emailjsServiceId,
        emailjsTemplateId,
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        emailjsPublicKey
      );

      if (res.status === 200) {
        toast({
          title: "Message Sent Successfully!",
          description: "We will get back to you soon. Thank you for contacting KC!",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
        setMessageCount(0);
      } else {
        throw new Error(res.text || "Unknown error");
      }
    } catch (error: any) {
      toast({
        title: "Failed to send message",
        description: error.text || error.message || "Please check your connection and try again.",
        variant: "destructive" as any,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["Buea, Southwest Region", "Cameroon"],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+237 680 789 894", "+237 650 986 127"],
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["kcstemhub@gmail.com"],
    },
  ];

  const subjects = [
    { value: "general", label: "General Inquiry" },
    { value: "admissions", label: "Admissions and Enrollment" },
    { value: "programs", label: "Academic Programs" },
    { value: "stem-competition", label: "STEM Competition" },
    { value: "partnership", label: "Partnership Opportunities" },
    { value: "support", label: "Technical Support" },
    { value: "other", label: "Other" },
  ];

  return (
    <section id="contact" className="pt-10 md:pt-12 lg:pt-14 pb-10 lg:pb-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="text-center mb-8 md:mb-12">
          <div className="h-1 w-28 mx-auto mb-3 bg-kc-blue rounded-full" />
          <h2 className="heading-2 mb-6">
            <span className="text-kc-blue">Contact Us</span>
          </h2>
          <p className="subheading max-w-3xl mx-auto leading-relaxed">
            Ready to join our STEM community or have questions? We would love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 lg:gap-12">
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="max-w-2xl mx-auto w-full">
              <Card className="bg-white/95 border border-kc-blue/10 ring-1 ring-kc-blue/5 shadow-card rounded-3xl">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-12 h-12 bg-kc-blue/10 text-kc-blue rounded-2xl flex items-center justify-center ring-1 ring-kc-blue/20">
                      <Send className="h-6 w-6" />
                    </div>
                    <h3 className="heading-3 text-kc-blue">Send us a Message</h3>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Enter your full name"
                          required
                          className="mt-2 rounded-2xl bg-white/95 border border-kc-blue/10 ring-1 ring-kc-blue/5 focus-visible:ring-2 focus-visible:ring-kc-blue/40"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Enter your email address"
                          required
                          className="mt-2 rounded-2xl bg-white/95 border border-kc-blue/10 ring-1 ring-kc-blue/5 focus-visible:ring-2 focus-visible:ring-kc-blue/40"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Select value={formData.subject} onValueChange={(v) => handleInputChange("subject", v)}>
                        <SelectTrigger id="subject" className="mt-2 rounded-2xl bg-white/95 border border-kc-blue/10 ring-1 ring-kc-blue/5 focus:ring-2 focus:ring-kc-blue/40">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Tell us how we can help you..."
                        rows={6}
                        required
                        className="mt-2 resize-none rounded-2xl bg-white/95 border border-kc-blue/10 ring-1 ring-kc-blue/5 focus-visible:ring-2 focus-visible:ring-kc-blue/40"
                      />
                      <div className="mt-1 text-xs text-muted-foreground text-right">{messageCount} / 1000</div>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full rounded-full gap-2 py-3">
                      {isSubmitting ? "Sending..." : "Send"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8 order-2 lg:order-1">
            <div>
              <h3 className="heading-3 mb-6 text-kc-blue">Get In Touch</h3>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="bg-white/95 border border-kc-blue/10 ring-1 ring-kc-blue/5 shadow-card transition-all duration-300 hover:-translate-y-1.5 rounded-3xl"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-kc-blue/10 text-kc-blue rounded-2xl flex items-center justify-center flex-shrink-0 ring-1 ring-kc-blue/20">
                        <info.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-kc-blue">{info.title}</h4>
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-kc-black/70 text-sm">{detail}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <h3 className="heading-3 text-center mb-6 md:mb-8 text-kc-blue">Find Us in Buea</h3>
          <Card className="shadow-card overflow-hidden bg-white/95 border border-kc-blue/10 ring-1 ring-kc-blue/5 rounded-3xl">
            <CardContent className="p-0">
              <div className="relative w-full aspect-[16/9]">
                <iframe
                  title="Knowledge Center KC - Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.316754043103!2d9.27541847471133!3d4.157989746123863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10613341d1c0ff45%3A0x3d7d600cd306579!2sKnowledge%20Center%20KC!5e0!3m2!1sen!2scm!4v1757380618185!5m2!1sen!2scm"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
