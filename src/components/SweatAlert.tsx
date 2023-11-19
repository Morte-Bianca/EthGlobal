import Swal from 'sweetalert2';

export const ToastError = Swal.mixin({
	toast: true,
	position: 'bottom-end',
	customClass: {
		container: 'items-center !w-full md:!w-1/2 xl:!w-1/3 ',
		title: '!text-xs md:!text-sm font-medium !flex items-center justify-start font-sans',
		htmlContainer: 'items-center !h-16',
		popup: 'dark:!bg-gray-800 !py-4 items-center dark:!text-gray-200',
		timerProgressBar: '!bg-red-500',
	},
	icon: 'error',

	showConfirmButton: false,
	timer: 4000,
	timerProgressBar: true,
	didOpen: (toast) => {
		toast.addEventListener('mouseenter', Swal.stopTimer);
		toast.addEventListener('mouseleave', Swal.resumeTimer);
	},
});
export const ToastSuccess = Swal.mixin({
	toast: true,
	position: 'bottom-end',
	icon: 'success',
	customClass: {
		container: 'items-center !w-full md:!w-1/2 xl:!w-1/3 ',
		title: '!text-xs md:!text-sm font-medium !flex items-center justify-start font-sans',
		htmlContainer: 'items-center !h-16',
		popup: 'dark:!bg-gray-800 !py-4 items-center dark:!text-gray-200',
		timerProgressBar: '!bg-green-400',
	},
	showConfirmButton: false,
	timer: 4000,
	timerProgressBar: true,
	didOpen: (toast) => {
		toast.addEventListener('mouseenter', Swal.stopTimer);
		toast.addEventListener('mouseleave', Swal.resumeTimer);
	},
});

export const Toast = Swal.mixin({
	toast: true,
	position: 'bottom-end',
	customClass: {
		container: 'items-center !w-full md:!w-1/2 xl:!w-1/3 ',
		title: '!text-xs md:!text-sm font-medium !flex items-center justify-start',
		htmlContainer: 'items-center !h-16',
		popup: 'dark:!bg-gray-800 !py-4 items-center dark:!text-gray-200',
	},

	showConfirmButton: false,
	timer: 4000,
	timerProgressBar: true,
	didOpen: (toast) => {
		toast.addEventListener('mouseenter', Swal.stopTimer);
		toast.addEventListener('mouseleave', Swal.resumeTimer);
	},
});
