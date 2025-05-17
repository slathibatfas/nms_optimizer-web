import { FC, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChangeLogContent from '../components/AppDialog/ChangeLogContent';
import InfoDialog from '../components/AppDialog/AppDialog';
import { APP_NAME } from "../constants";

interface ChangelogPageProps {
  rootPathSearch: string;
}

const ChangelogPage: FC<ChangelogPageProps> = ({ rootPathSearch }) => {
  const navigate = useNavigate();
  const changeLogDialogContent = useMemo(() => <ChangeLogContent />, []);

  useEffect(() => {
    document.title = `Changelog | ${APP_NAME}`;
  }, []);

  return (
    <InfoDialog
      isOpen={true}
      onClose={() => navigate(`/${rootPathSearch}`)}
      content={changeLogDialogContent}
      title="Changelog"
    />
  );
};

export default ChangelogPage;