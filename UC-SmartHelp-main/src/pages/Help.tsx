import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const sections = [
  {
    title: "General Information",
    items: [
      ["What is the University of Cebu?", "The University of Cebu (UC) is a private, non-profit university in Cebu offering undergraduate, graduate, and diploma programs across various fields."],
      ["Where is UC located?", "The main campus is located at Sanciangko Street, Cebu City, with other campuses in Banilad, Mandaue, and Mambaling."],
      ["What programs does UC offer?", "UC offers programs in IT, business, engineering, healthcare, hospitality, law, and more."],
    ],
  },
  {
    title: "Admissions",
    items: [
      ["What are the requirements for new college students?", "High School Report Card (Form 138), Birth Certificate (PSA/NSO), Certificate of Good Moral Character, and ID photos."],
      ["What are the requirements for transferees?", "Transcript of Records / Report Card, Transfer Credentials, Good Moral Certificate, Birth Certificate, and Entrance exam results."],
      ["Do I need an entrance exam?", "Some programs may require entrance exams and evaluation depending on the course."],
    ],
  },
  {
    title: "Student Types",
    items: [
      ["What documents do returning students need?", "Previous semester report card."],
      ["What if I shift courses?", "Copy of grades, good moral certificate, and IQ test results."],
    ],
  },
  {
    title: "Enrollment",
    items: [
      ["How do I enroll?", "Prepare required documents, submit application, complete enrollment form, and pay assessment fees. You can also enroll online via the UC portal."],
      ["Is online enrollment available?", "Yes, UC provides an online enrollment system for all levels."],
    ],
  },
  {
    title: "Tuition and Fees",
    items: [
      ["How much is the tuition fee?", "Typically around PHP 20,000 to PHP 35,000 per semester depending on the course. Example: IT around PHP 22,000, Nursing around PHP 30,000."],
      ["Does UC offer scholarships?", "Yes, including academic scholarships, athletic scholarships, and government scholarships (CHED, TES, DOST)."],
    ],
  },
  {
    title: "Scholarships",
    items: [
      ["What are the basic scholarship requirements?", "At least 85% GPA, birth certificate, application form, and ID photo."],
    ],
  },
  {
    title: "Campus and Facilities",
    items: [
      ["What facilities are available?", "Libraries, laboratories (e.g., wireless labs), sports facilities, student services, and admission/acceptance support."],
      ["Is UC hard to get into?", "UC has a relatively high acceptance rate (around 80 to 89%), making it accessible to most applicants."],
    ],
  },
  {
    title: "Contact Information",
    items: [
      ["How can I contact UC?", "Phone: (032) 255-7777 | Email: main.collegeregistrar@uc.edu.ph"],
    ],
  },
  {
    title: "Academic Programs",
    items: [
      ["Program areas", "College of Information and Computer Studies, College of Engineering, College of Nursing, Maritime Education, Hospitality and Tourism, Business and Accountancy."],
    ],
  },
];

const Help = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    const isGuest = localStorage.getItem("uc_guest") === "1";
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    const role = (user?.role || "").toString().toLowerCase();
    const department = (user?.department || "").toString().toLowerCase();

    if (isGuest) {
      navigate("/GuestDashboard");
      return;
    }
    if (role === "admin") {
      navigate("/AdminDashboard");
      return;
    }
    if (role === "staff") {
      navigate(department === "scholarship" ? "/ScholarshipDashboard" : "/AccountingDashboard");
      return;
    }
    if (role === "student") {
      navigate("/StudentDashboard");
      return;
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10 space-y-6">
        <div className="space-y-2 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute right-0 top-0 text-muted-foreground hover:text-foreground"
            aria-label="Close help"
          >
            <X className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-extrabold tracking-tight">Help and FAQ</h1>
        </div>

        <div className="grid gap-4">
          {sections.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.items.map(([q, a]) => (
                  <div key={q} className="rounded-lg border bg-muted/20 p-4">
                    <p className="font-semibold">Q: {q}</p>
                    <p className="text-sm text-muted-foreground mt-1">A: {a}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Help;
