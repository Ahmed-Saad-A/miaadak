
import Settings from "@/components/system/Profile";

export default function Page() {
  return (
    <>
      <Settings
        user={{
          id: 1, role: "student",
          firstName: "أحمد", lastName: "محمود",
          email: "ahmed@example.com", phone: "01012345678",
          level: "الصف الثالث الإعدادي",
          avatarUrl: "",
        }}
        // onSave={async (data) => {
        //   await studentApi.updateProfile(data);
        // }}
      />
    </>
  );
}
