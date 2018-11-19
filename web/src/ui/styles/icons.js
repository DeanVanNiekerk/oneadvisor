import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

export const loadIcons = () => {
    library.add(faUser);
    library.add(faShieldAlt);
};
