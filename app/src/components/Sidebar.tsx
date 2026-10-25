import React from 'react';
import { useTranslation } from 'react-i18next'; // Import the hook for translations
import '../styles/Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { t } = useTranslation(); // Initialize the translation hook

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button
        className="close-sidebar"
        onClick={toggleSidebar}
        aria-label={t("sidebar.closeSidebar")}
      >
        &times;
      </button>
      <nav className="sidebar-nav">
        <ul>
          <li><a href="/foodproducts">{t("sidebar.foodProducts")}</a></li>
          <li><a href="/dietgenerator">{t("sidebar.dietGenerator")}</a></li>
          <li><a href="/profile">{t("sidebar.profile")}</a></li>
          <li><a href="/geolocation">{t("sidebar.geolocation")}</a></li>
          <li><a href="/clipboard">{t("sidebar.clipboard")}</a></li>
          <li><a href="/file">{t("sidebar.file")}</a></li>
          <li><a href="/network">{t("sidebar.network")}</a></li>
          <li><a href="/bluetooth">{t("sidebar.bluetooth")}</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
