import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toolbar } from '../../../core/components';
import { ThemeContext } from '~/contexts/ThemeContext.tsx';
import { LockClosedIcon, GlobeAltIcon, MoonIcon } from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';

export default function Settings() {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const viewChangePassword = () => {
    navigate('/settings/change-password');
  };

  const viewOfficialHolidays = () => {
    navigate('/settings/official-holiday');
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  return (
      <div className="md:w-4/5 w-full overflow-y-auto fixed top-16 md:top-0 bottom-0 right-0">
        <div className="pt-4 md:mx-auto md:w-full md:max-w-[70%]">
          <Toolbar title="Settings" />

          <main className="px-4">
            <button
                onClick={viewChangePassword}
                className="flex items-center mb-5 text-sm font-semibold md:text-base"
            >
              <LockClosedIcon
                  className="w-8 h-8 mr-2 bg-indigo-200 dark:bg-indigo-300 p-1.5 text-indigo-500 rounded-lg"
              />
              Change Password
            </button>

            <button
                onClick={viewOfficialHolidays}
                className="flex items-center mb-5 text-sm font-semibold md:text-base"
            >
              <GlobeAltIcon
                  className="w-8 h-8 mr-2 bg-indigo-200 dark:bg-indigo-300 p-1.5 text-indigo-500 rounded-lg"
              />
              Official Holidays
            </button>

            <div className="flex justify-between items-center text-sm font-semibold md:text-base">
              <div className="flex items-center">
                <MoonIcon
                    className="w-8 h-8 mr-2 bg-indigo-200 dark:bg-indigo-300 p-1.5 text-indigo-500 rounded-lg"
                />
                Dark mode
              </div>
              <Switch
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                  className={classNames(
                      isDarkMode ? 'bg-indigo-500' : 'bg-slate-300',
                      'relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                  )}
              >
              <span
                  aria-hidden="true"
                  className={classNames(
                      isDarkMode ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                  )}
              />
              </Switch>
            </div>
          </main>
        </div>
      </div>
  );
}