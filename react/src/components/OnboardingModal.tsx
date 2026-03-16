import { useState, useEffect, FC, KeyboardEvent } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UserProfile {
    name: string;
    avatar: string;
    color: string;
}

interface OnboardingModalProps {
    onComplete: (profile: UserProfile) => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const AVATAR_EMOJIS: string[] = [
    "😄",
    "😎",
    "🤩",
    "🥳",
    "😇",
    "🤓",
    "😺",
    "🐻",
    "🦊",
    "🐼",
    "🌻",
    "⭐",
    "🍕",
    "🎸",
    "🎮",
    "🚀",
    "🦋",
    "🍀",
];

const ACCENT_COLORS: string[] = [
    "#FF6B6B",
    "#4D96FF",
    "#6BCB77",
    "#FFD93D",
    "#FF922B",
    "#845EC2",
    "#F9A8D4",
    "#67E8F9",
    "#86EFAC",
    "#FCA5A5",
];

// ── Storage helpers ───────────────────────────────────────────────────────────

const STORAGE_KEY = "ff_user_profile";

export function loadProfile(): UserProfile | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as UserProfile) : null;
    } catch {
        return null;
    }
}

export function saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

// ── Component ─────────────────────────────────────────────────────────────────

const OnboardingModal: FC<OnboardingModalProps> = ({ onComplete }) => {
    const [name, setName] = useState<string>("");
    const [selectedEmoji, setSelectedEmoji] = useState<string>(
        AVATAR_EMOJIS[0],
    );
    const [selectedColor, setSelectedColor] = useState<string>(
        ACCENT_COLORS[0],
    );
    const [nameError, setNameError] = useState<boolean>(false);

    // sync accent CSS variable with selected color
    useEffect(() => {
        document.documentElement.style.setProperty(
            "--ob-accent",
            selectedColor,
        );
    }, [selectedColor]);

    const trimmedName = name.trim();
    const canSubmit = trimmedName.length > 0;

    const handleSubmit = (): void => {
        if (!trimmedName) {
            setNameError(true);
            setTimeout(() => setNameError(false), 400);
            return;
        }
        const profile: UserProfile = {
            name: trimmedName,
            avatar: selectedEmoji,
            color: selectedColor,
        };
        saveProfile(profile);
        onComplete(profile);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter") handleSubmit();
    };

    return (
        <>
            {/* Non-dismissable backdrop — no onClick handler */}
            <div className="ob-backdrop">
                <div
                    className="ob-card"
                    style={
                        { "--ob-accent": selectedColor } as React.CSSProperties
                    }
                >
                    {/* Header */}
                    <div className="ob-header">
                        <span className="ob-wave">👋</span>
                        <div className="ob-title">Привет! Как тебя зовут?</div>
                        <div className="ob-subtitle">
                            Расскажи немного о себе, прежде чем войти в ленту
                        </div>
                    </div>

                    {/* Name */}
                    <label className="ob-label" htmlFor="ob-name-input">
                        Твоё имя
                    </label>
                    <div className="ob-input-wrap">
                        <input
                            id="ob-name-input"
                            className={`ob-input${nameError ? " error" : ""}`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Введи своё имя…"
                            maxLength={24}
                            autoFocus
                        />
                        <span
                            className={`ob-input-icon${!trimmedName ? " hidden" : ""}`}
                        >
                            ✅
                        </span>
                    </div>

                    {/* Avatar */}
                    <div className="ob-avatar-section">
                        <label className="ob-label">Выбери аватар</label>
                        <div className="ob-avatar-grid">
                            {AVATAR_EMOJIS.map((emoji) => (
                                <button
                                    key={emoji}
                                    className={`ob-avatar-btn${selectedEmoji === emoji ? " selected" : ""}`}
                                    onClick={() => setSelectedEmoji(emoji)}
                                    title={emoji}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color */}
                    <div className="ob-color-section">
                        <label className="ob-label">Цвет профиля</label>
                        <div className="ob-color-row">
                            {ACCENT_COLORS.map((color) => (
                                <button
                                    key={color}
                                    className={`ob-color-dot${selectedColor === color ? " selected" : ""}`}
                                    style={{ background: color, color }}
                                    onClick={() => setSelectedColor(color)}
                                    title={color}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="ob-preview">
                        <div
                            className="ob-preview-avatar"
                            style={{
                                background: `${selectedColor}22`,
                                border: `3px solid ${selectedColor}`,
                            }}
                        >
                            {selectedEmoji}
                        </div>
                        <div>
                            {trimmedName ? (
                                <div className="ob-preview-name">
                                    {trimmedName}
                                </div>
                            ) : (
                                <div className="ob-preview-hint">
                                    Введи имя, чтобы увидеть превью
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        className="ob-submit"
                        disabled={!canSubmit}
                        onClick={handleSubmit}
                    >
                        {canSubmit
                            ? `Войти как ${trimmedName} ${selectedEmoji}`
                            : "Сначала введи имя…"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default OnboardingModal;
