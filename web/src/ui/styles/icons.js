import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faUser,
    faShieldAlt,
    faSync,
    faExclamation,
    faUsers,
    faBuilding,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';

export const loadIcons = () => {
    library.add(faUser);
    library.add(faShieldAlt);
    library.add(faSync);
    library.add(faExclamation);
    library.add(faUsers);
    library.add(faBuilding);
    library.add(faSpinner);
};
