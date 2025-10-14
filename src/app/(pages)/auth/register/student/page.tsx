"use client";

import { StudentForm } from "@/components/shared";
import student from "@/assets/student1.png";
import Image from "next/image";

const StudentRegistrationPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Registration Form */}
          <div className="order-2 lg:order-1">
            <StudentForm />
          </div>

          {/* Right side - Animated Side */}
          <div className="order-1 lg:order-2">
            <Image
              src={student}
              alt="Student Registration"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistrationPage;