import React from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

const InstructionsContent: React.FC = () => {
	const { t } = useTranslation();

	const content = t("dialogs.content.instructions");

	return (
		<article className="text-base">
			<ReactMarkdown>{content}</ReactMarkdown>
		</article>
	);
};

export default React.memo(InstructionsContent);
