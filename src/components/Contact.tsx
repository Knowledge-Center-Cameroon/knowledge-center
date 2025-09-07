import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Send,
  MessageSquare,
  Users,
  HelpCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AeroButton } from "@/components/aerobutton";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const WEB3FORMS_KEY = (import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === "message") {
      setMessageCount(value.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: "Please fill all required fields", description: "Name, Email and Message are required." });
      return;
    }
    if (!formData.subject) {
      toast({ title: "Select a subject", description: "Please choose a subject so we can route your message." });
      return;
    }

    setIsSubmitting(true);

    // Submit to Web3Forms if configured
    if (WEB3FORMS_KEY) {
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          }),
        });

        const data = await res.json().catch(() => ({} as any));
        if (res.ok && data?.success) {
          toast({
            title: "Message Sent Successfully!",
            description: "We'll get back to you within 24 hours. Thank you for contacting KC!",
          });
          setFormData({ name: "", email: "", subject: "", message: "" });
          setMessageCount(0);
        } else {
          toast({
            title: "Failed to send message",
            description: data?.message || "Please try again or email us directly at kcstemhub@gmail.com",
          });
        }
      } catch (err) {
        toast({
          title: "Network error",
          description: "Please check your connection and try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Fallback if not configured
      setTimeout(() => {
        toast({
          title: "Demo: Message not actually sent",
          description: "Set VITE_WEB3FORMS_ACCESS_KEY in your .env to enable real submissions.",
        });
        setIsSubmitting(false);
      }, 600);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["Buea, Southwest Region", "Cameroon"],
      color: "text-blue-600"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+237 680 789 894", "+237 671 316 3526"],
      color: "text-green-600"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["kcstemhub@gmail.com"],
      color: "text-purple-600"
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Mon - Fri: 8:00 AM - 6:00 PM", "Sat: 9:00 AM - 4:00 PM"],
      color: "text-orange-600"
    }
  ];

  const subjects = [
    { value: "general", label: "General Inquiry" },
    { value: "admissions", label: "Admissions & Enrollment" },
    { value: "programs", label: "Academic Programs" },
    { value: "stem-competition", label: "STEM Competition" },
    { value: "partnership", label: "Partnership Opportunities" },
    { value: "support", label: "Technical Support" },
    { value: "other", label: "Other" }
  ];

  return (
    <section id="contact" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="heading-2 mb-6">
            <span className="text-kc-blue">Contact</span> <span className="text-kc-red">Us</span>
          </h2>
          <p className="subheading max-w-3xl mx-auto leading-relaxed">
            Ready to join our STEM community or have questions? We'd love to hear from you. 
            Get in touch and let's start the conversation.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h3 className="text-2xl font-heading font-bold mb-6">Get In Touch</h3>
              <p className="text-muted-foreground mb-8">
                Whether you're interested in our programs, have questions about admissions, 
                or want to explore partnership opportunities, we're here to help.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="card-gradient shadow-elegant transition-bounce hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 bg-kc-black rounded-full flex items-center justify-center flex-shrink-0`}>
                        <info.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{info.title}</h4>
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-muted-foreground text-sm">{detail}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-kc-black rounded-xl p-6 text-white">
              <h4 className="font-semibold mb-4">Need Immediate Help?</h4>
              <div className="space-y-3">
                <Button 
                  variant="red"
                  className="w-full"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Live Chat Support
                </Button>
                <Button 
                  variant="blackOutline"
                  className="w-full border-white text-white hover:bg-white hover:text-kc-black"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQ Section
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="max-w-2xl mx-auto w-full">
            <Card className="card-gradient shadow-elegant">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-12 h-12 bg-kc-blue rounded-full flex items-center justify-center">
                    <Send className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold">Send us a Message</h3>
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
                        className="mt-2"
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
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                      <SelectTrigger className="mt-2" id="subject">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.value} value={subject.value}>
                            {subject.label}
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
                      className="mt-2 resize-none"
                    />
                    <div className="mt-1 text-xs text-muted-foreground text-right">{messageCount} / 1000</div>
                  </div>

                  {/* CAPTCHA placeholder */}
                  <div className="p-4 border-2 border-dashed border-muted rounded-lg text-center text-muted-foreground">
                    <div className="w-8 h-8 bg-muted rounded mx-auto mb-2"></div>
                    <span className="text-sm">CAPTCHA verification would go here</span>
                  </div>

                  <AeroButton
                    type="submit"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    text="Send"
                    width={30}
                    primaryCol="#FF6B6B"
                    gradientCol="#FFD93D"
                    className="w-full rounded-full gap-2 text-white py-3"
                  />
                </form>
              </CardContent>
            </Card>
            </div>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="mt-16">
          <h3 className="text-2xl font-heading font-bold text-center mb-8">Find Us in Buea</h3>
          <Card className="shadow-elegant overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-96 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Interactive Map</p>
                  <p className="text-sm">Google Maps integration would be embedded here</p>
                  <p className="text-xs mt-2">Location: Buea, Southwest Region, Cameroon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;