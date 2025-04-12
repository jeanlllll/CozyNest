import { useEffect } from "react";

export const usePageMeta = ({ titleEn, titleZh, isEnglish }) => {
    useEffect(() => {
        document.title = isEnglish ? `CozyNest | ${titleEn}` : `CozyNest | ${titleZh}`;

        const favicon = document.querySelector("link[rel='icon']");
        if (favicon) {
            favicon.href = "/images/cozyNestLogo.png";
        }
    }, [isEnglish, titleEn, titleZh])
}