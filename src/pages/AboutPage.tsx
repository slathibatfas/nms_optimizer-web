import { type FC, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AboutContent from "../components/AppDialog/AboutContent";
import InfoDialog from "../components/AppDialog/AppDialog";
import { useMarkdownContent } from "../hooks/useMarkdownContent";
import { APP_NAME } from "../constants";

const AboutPage: FC = () => {
	const navigate = useNavigate();
	const { isLoading, error } = useMarkdownContent("about");
	const AboutDialogContent = useMemo(() => <AboutContent />, []);

	useEffect(() => {
		document.title = `About | ${APP_NAME}`;
	}, []);

	return (
		<InfoDialog
			isOpen={!isLoading && !error}
			onClose={() => navigate("/")} // Navigate back
			content={AboutDialogContent}
			title="About"
		/>
	);
};

export default AboutPage;
