import Image from "next/image";
import Link from "next/link";
import css from "./page.module.css";

export default function ProfilePage() {
  // For now, show a simple profile page without authentication
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
            src="/avatar.svg"
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: Guest User</p>
          <p>Email: guest@example.com</p>
        </div>
      </div>
    </main>
  );
}
