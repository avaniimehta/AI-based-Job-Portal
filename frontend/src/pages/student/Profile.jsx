import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

const Profile = () => {
  const { user } = useAuth();

  const [skills, setSkills]         = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation]   = useState("");
  const [bio, setBio]               = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving]         = useState(false);

  // Load existing profile data from DB when component mounts
  useEffect(() => {
    if (!user?.id) {
      setLoadingProfile(false);
      return;
    }

    api.get(`/users/profile?user_id=${user.id}`)
      .then(res => {
        const p = res.data;
        setSkills(p.skills || "");
        setExperience(p.experience || "");
        setEducation(p.education || "");
        setBio(p.bio || "");
      })
      .catch(err => {
        console.error("Could not load profile:", err);
      })
      .finally(() => setLoadingProfile(false));
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) {
      alert("You must be logged in to save your profile.");
      return;
    }

    setSaving(true);
    try {
      const res = await api.post("/users/profile", {
        user_id: user.id,
        skills,
        experience,
        education,
        bio,
      });

      if (res.status === 200 || res.status === 201) {
        alert("Profile saved successfully ✅");
      } else {
        alert(res.data?.message || "Save failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Get first name for greeting
  const firstName = user?.name ? user.name.split(" ")[0] : "there";

  if (loadingProfile) {
    return (
      <div className="spinner-page">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "auto" }}>
      <h2>👋 Welcome, {firstName}!</h2>

      <p>Tell us a bit about yourself so we can match you with jobs.</p>

      <label>Skills *</label>
      <input
        type="text"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        placeholder="react, python, sql"
        style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
      />

      <label>Experience</label>
      <input
        type="text"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        placeholder="fresher"
        style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
      />

      <label>Education</label>
      <input
        type="text"
        value={education}
        onChange={(e) => setEducation(e.target.value)}
        placeholder="BCA"
        style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
      />

      <label>Short Bio</label>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell recruiters what makes you stand out..."
        style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
      />

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          padding: "12px",
          width: "100%",
          backgroundColor: "#6366f1",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: saving ? "not-allowed" : "pointer",
          opacity: saving ? 0.7 : 1,
        }}
      >
        {saving ? "Saving…" : "Save Profile"}
      </button>
    </div>
  );
};

export default Profile;
