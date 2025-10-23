"use client";

import React from "react";
import { motion } from "framer-motion";
import MainLogo from "@/assets/mainLogo.png";
import Image from "next/image";

const Footer = () => {
    return (
        <footer className="relative overflow-hidden bg-[#D6D6D6] text-[#2c2c2c] py-10 md:py-16 px-6 md:px-20">
            <motion.div
                className="absolute inset-0 z-0"
                animate={{
                    background: [
                        "radial-gradient(circle at 20% 80%, #D99752 0%, transparent 60%)",
                        "radial-gradient(circle at 80% 20%, #FACE91 0%, transparent 60%)",
                        "radial-gradient(circle at 50% 50%, #F54A00 0%, transparent 70%)",
                    ],
                }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            />

            <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180 z-0">
                <svg
                    className="relative block w-[calc(100%+1.3px)] h-[60px]"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    viewBox="0 0 1200 120"
                >
                    <path
                        d="M985.66 92.83C906.67 72.5 823.78 31 743.84 26.42 673.52 22.38 603.12 53.77 532.8 73.54 462.48 93.31 392.08 101.47 321.76 89.45 241.82 76 161.89 42.8 81.95 27.22 54.63 21.92 27.32 19.92 0 20.18V120h1200V97.58c-68.11 13.36-136.22 19.36-214.34-4.75z"
                        fill="#FFFFFF"
                    ></path>
                </svg>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-right">
                <motion.div
                    initial={{ scale: 0.8, rotateY: 0 }}
                    whileInView={{ scale: 1, rotateY: 360 }}
                    transition={{ duration: 1.8, type: "spring" }}
                    className="flex flex-col items-center md:items-start"
                >
                    <div className="bg-[#F54A00]/10 backdrop-blur-md p-4 rounded-2xl shadow-[6px_6px_12px_#bbb,-6px_-6px_12px_#fff]">
                        <Image
                            src={MainLogo}
                            alt="شعار الموقع"
                            className="w-20 h-20 object-contain drop-shadow-lg"
                        />
                    </div>
                    <h2 className="text-xl font-bold mt-3 text-[#F54A00] drop-shadow-md">
                        معادك
                    </h2>
                    <p className="text-sm text-[#444] mt-1">
                        نظام ذكي لحجز ومتابعة حضور الطلاب
                    </p>
                </motion.div>

                {/* روابط */}
                <motion.ul
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="flex flex-col md:flex-row gap-4 md:gap-8 text-lg font-medium"
                >
                    {["الرئيسية", "المعلمين", "الطلاب", "التقارير", "تواصل معنا"].map(
                        (link, i) => (
                            <motion.li
                                key={i}
                                whileHover={{
                                    scale: 1.1,
                                    color: "#F54A00",
                                    textShadow: "0 0 8px #F54A00",
                                }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="cursor-pointer"
                            >
                                {link}
                            </motion.li>
                        )
                    )}
                </motion.ul>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm md:text-base text-[#444] font-medium"
                >
                    © {new Date().getFullYear()} جميع الحقوق محفوظة - موقع{" "}
                    <span className="text-[#F54A00] font-semibold">معادك</span>
                </motion.p>
            </div>
        </footer>
    );
};

export default Footer;
