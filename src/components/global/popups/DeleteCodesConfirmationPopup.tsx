import React from 'react'
import PopupModal from './PopupModal';
import PopupBox from './PopupBox';
import { deleteCodesFromLocalStorage } from '../../../utils/localStorageHelper';

interface DeleteCodesConfirmationPopupProps {
    openConfirmationPopup: boolean;
    setOpenConfirmationPopup: (open: boolean) => void;
}

const DeleteCodesConfirmationPopup: React.FC<DeleteCodesConfirmationPopupProps> = ({
    openConfirmationPopup,
    setOpenConfirmationPopup
}) => {

    const deleteCodes = () => {
        setOpenConfirmationPopup(false);
        deleteCodesFromLocalStorage();
    };

    return (
        <PopupModal isOpen={openConfirmationPopup} setIsOpen={setOpenConfirmationPopup}>
            <PopupBox isOpen={openConfirmationPopup} setIsOpen={setOpenConfirmationPopup} title="Delete Codes" customClass="w-[100%]" popupHeight="h-auto">
                <div
                    className={`text-gray-700 dark:text-darkText-400  z-20 opacity-100 bg-white rounded-md shadow-sm dark:bg-darkBox-900  mx-auto relative`}
                >
                    <p className="mt-2 text-sm text-gray-600 dark:text-darkText-300">
                        Are you sure you want to delete all saved codes?
                        <br />
                        This action will remove all your saved codes from local storage permanently and cannot be undone.
                    </p>

                    <div className="flex justify-end mt-4 space-x-2">
                        <button
                            onClick={() => setOpenConfirmationPopup(false)}
                            className="px-4 py-2 text-sm text-gray-700 transition-colors duration-200 bg-gray-200 rounded-md dark:text-darkText-400 dark:bg-darkBox-800 dark:hover:bg-gray-800 dark:border-darkBorder-700 dark:border hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={deleteCodes}
                            className="px-4 py-2 text-sm text-white transition-colors duration-200 bg-red-600 rounded-md hover:bg-red-700"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </PopupBox>
        </PopupModal>
    )
}

export default DeleteCodesConfirmationPopup