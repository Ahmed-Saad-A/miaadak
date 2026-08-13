# Registration Flow Components

This directory contains the complete registration flow UI components built with React, Tailwind CSS, and Framer Motion.

## Components Structure

### Core Components

- **ProgressIndicator**: Circular progress stepper with phosphor green animations
- **TeacherForm**: 3-step teacher registration form
- **StudentForm**: 3-step student registration form  
- **ParentForm**: 3-step parent registration form
- **AnimatedSide**: Existing animated side component (unchanged)

### Registration Pages

- `/auth/register` - Main registration page with type selection
- `/auth/register/teacher` - Teacher registration flow
- `/auth/register/student` - Student registration flow
- `/auth/register/parent` - Parent registration flow

## Features

### Design
- ✅ RTL (Arabic) support
- ✅ Phosphor green (#00FF9C) accent color
- ✅ Soft, modern spacing with rounded-2xl borders
- ✅ Subtle shadows and gradients
- ✅ Clean white background with light-gray accents

### Animations
- ✅ Page content slides in from bottom on mount
- ✅ Smooth horizontal slide transitions between steps
- ✅ Fast transitions (0.3-0.5s) with Framer Motion
- ✅ Active step circle glows and scales
- ✅ Progress line fills gradually with animation

### Responsive Design
- ✅ Desktop: Side-by-side layout (form left, AnimatedSide right)
- ✅ Mobile: Stacked layout (AnimatedSide above form)
- ✅ Fully responsive with Tailwind CSS

### Form Steps

#### Teacher Registration (3 steps)
1. First Name, Last Name, Email
2. Password, Confirm Password  
3. Phone Number, Gender, Department/Specialty

#### Student Registration (3 steps)
1. First Name, Last Name, Email
2. Phone Number, Password, Confirm Password
3. Gender

#### Parent Registration (3 steps)
1. Email, Student Code
2. Password, Confirm Password
3. Gender

## Technical Stack

- React 19
- Next.js 15.5.3
- Tailwind CSS 4
- Framer Motion 12.23.22
- TypeScript
- Ready for react-hook-form + zod integration

## Usage

All components are exported from `@/components/shared` and ready to use. The forms include proper form field names for easy integration with validation libraries.

```tsx
import { TeacherForm, StudentForm, ParentForm, AnimatedSide } from "@/components/shared";
```
