import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getMe } from "@/lib/api/serverApi";
import css from "./page.module.css";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "User profile page",
};

export default async function ProfilePage() {
  let user = null;

  try {
    user = await getMe();
  } catch {
    // User not authenticated, will show default state
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user?.avatar || "/avatar.svg"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user?.username || "Guest User"}</p>
          <p>Email: {user?.email || "guest@example.com"}</p>
        </div>
      </div>
    </main>
  );
}
