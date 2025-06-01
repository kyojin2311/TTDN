"use client";

import Loading from "@/components/Loading";
import { useAuthContext } from "@/lib/context/AuthContext";
import LandingPageComponent from "@/packages/landing-page";

export default function Home() {
  const { loading } = useAuthContext();

  if (loading) {
    return <Loading />;
  }

  return <LandingPageComponent />;
}
