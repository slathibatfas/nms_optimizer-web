// src/components/AppDialog/MarkdownContentRenderer.tsx
import { Spinner } from "@radix-ui/themes";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeExternalLinks from "rehype-external-links";

import { useMarkdownContent } from "../../hooks/useMarkdownContent";

interface MarkdownContentRendererProps {
	markdownFileName: string;
}

const MarkdownContentRenderer: React.FC<MarkdownContentRendererProps> = ({ markdownFileName }) => {
	const { markdown, isLoading, error } = useMarkdownContent(markdownFileName);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center w-full h-32">
				<Spinner className="dialogSpinner__spinner" />
			</div>
		);
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<article className="text-base">
			<ReactMarkdown
				rehypePlugins={[
					[rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
				]}
			>
				{markdown}
			</ReactMarkdown>
		</article>
	);
};

export default React.memo(MarkdownContentRenderer);
