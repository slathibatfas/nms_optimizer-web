import { FC, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AboutContent from "../components/AppDialog/AboutContent";
import InfoDialog from "../components/AppDialog/AppDialog";
import { APP_NAME } from "../constants";

interface AboutPageProps {
  rootPathSearch: string;
}

const AboutPage: FC<AboutPageProps> = ({ rootPathSearch }) => {
  const navigate = useNavigate();
  const AboutDialogContent = useMemo(() => <AboutContent />, []);

  useEffect(() => {
    document.title = `About | ${APP_NAME}`;
  }, []);

  return (
    <InfoDialog
      isOpen={true}
      onClose={() => navigate(`/${rootPathSearch}`)}
      content={AboutDialogContent}
      title="About"
    />
  );
};

export default AboutPage;
