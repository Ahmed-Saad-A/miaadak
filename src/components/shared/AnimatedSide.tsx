"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import student from "@/assets/student.png";

const AnimatedSide = () => {
    return (
        <div className="relative flex justify-center items-center w-full">
            {/* الدواير الخلفية المتحركة */}
            <motion.div
                className="absolute top-20 left-10 w-32 h-32 bg-orange-100 rounded-full"
                animate={{ y: [0, 30, 0] }}
                transition={{ repeat: Infinity, duration: 6 }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-40 h-40 bg-blue-100 rounded-full"
                animate={{ x: [0, -30, 0] }}
                transition={{ repeat: Infinity, duration: 8 }}
            />

            {/* صورة الطالب */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <Image
                    src={student}
                    alt="Student with Shape"
                    className="w-72 md:w-96 object-contain drop-shadow-xl relative z-10"
                />
            </motion.div>
        </div>
    );
};

export default AnimatedSide;
