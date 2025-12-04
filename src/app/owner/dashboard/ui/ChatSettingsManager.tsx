"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type ChatSettings = {
  greeting_message: string;
  reply_time_text: string;
  avatar_url: string | null;
};

export default function ChatSettingsManager() {
  const [settings, setSettings] = useState<ChatSettings>({
    greeting_message: "",
    reply_time_text: "",
    avatar_url: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const response = await fetch("/api/owner/chat-settings/get");
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (error) {
      console.error("Failed to fetch chat settings:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/owner/chat-settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage("Chat settings saved successfully!");
      } else {
        setMessage("Failed to save settings.");
      }
    } catch (error) {
      setMessage("Error saving settings.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", `avatar-${Date.now()}-${file.name}`);

    try {
      const response = await fetch("/api/owner/avatar/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const updatedSettings = { ...settings, avatar_url: data.url };
        setSettings(updatedSettings);
        setMessage("Avatar uploaded successfully!");
        
        // Auto-save to database
        try {
          const saveResponse = await fetch("/api/owner/chat-settings/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedSettings),
          });
          if (!saveResponse.ok) {
            setMessage("Avatar uploaded but failed to save. Please click 'Save Changes'.");
          }
        } catch (error) {
          setMessage("Avatar uploaded but failed to save. Please click 'Save Changes'.");
          console.error("Auto-save error:", error);
        }
      } else {
        const error = await response.json();
        setMessage(`Failed to upload avatar: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage("Error uploading avatar.");
      console.error("Avatar upload error:", error);
    } finally {
      setUploadingAvatar(false);
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading chat settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Chat Widget Settings</h2>
        <p className="text-sm text-gray-600">
          Customize the chat widget that appears on your website
        </p>
      </div>

      {/* Avatar */}
      <div>
        <label className="block text-sm font-medium mb-2">Avatar Image</label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center font-bold text-black overflow-hidden">
            {settings.avatar_url ? (
              <Image
                src={settings.avatar_url}
                alt="Avatar"
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="relative inline-block text-xl tracking-tighter leading-none translate-x-2">
                <span className="relative -mr-1">P</span>
                <span className="relative -ml-1">C</span>
              </span>
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploadingAvatar}
              className="text-sm"
              aria-label="Upload avatar image"
              title="Upload avatar image"
            />
            {uploadingAvatar && (
              <p className="text-xs text-gray-500 mt-1">Uploading...</p>
            )}
          </div>
        </div>
      </div>

      {/* Greeting Message */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Greeting Message
        </label>
        <textarea
          value={settings.greeting_message}
          onChange={(e) =>
            setSettings({ ...settings, greeting_message: e.target.value })
          }
          rows={3}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand focus:border-transparent"
          placeholder="👋 Hi! I'm Porscha. Have questions about..."
        />
        <p className="text-xs text-gray-500 mt-1">
          This message appears when visitors first open the chat
        </p>
      </div>

      {/* Reply Time Text */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Reply Time Text
        </label>
        <input
          type="text"
          value={settings.reply_time_text}
          onChange={(e) =>
            setSettings({ ...settings, reply_time_text: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand focus:border-transparent"
          placeholder="Typically replies within hours"
        />
        <p className="text-xs text-gray-500 mt-1">
          Shows below your name in the chat header
        </p>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-brand text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand/90 transition disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
        {message && (
          <span
            className={`text-sm ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </span>
        )}
      </div>

      {/* Preview */}
      <div className="border-t pt-6">
        <h3 className="font-medium mb-3">Preview</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="bg-brand text-white p-3 rounded-t-lg flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center font-bold text-black overflow-hidden">
              {settings.avatar_url ? (
                <Image
                  src={settings.avatar_url}
                  alt="Preview"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="relative inline-block text-sm tracking-tighter leading-none translate-x-1.5">
                  <span className="relative -mr-0.5">P</span>
                  <span className="relative -ml-0.5">C</span>
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">Color Rebel by Porscha</div>
              <div className="text-xs text-white/80">{settings.reply_time_text}</div>
            </div>
          </div>
          <div className="bg-white p-3 rounded-b-lg">
            <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 inline-block max-w-[85%]">
              <p className="text-xs text-gray-800">{settings.greeting_message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
