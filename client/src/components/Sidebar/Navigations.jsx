import { useEffect } from 'react';
import {
	FaThLarge,
	FaUserCircle,
	FaClipboardList,
	FaChartLine,
	FaCalendarAlt,
	FaTasks,
	FaCog,
	FaQuestionCircle,
	FaChild,
	FaUserGraduate
} from 'react-icons/fa';
export const STUDENTS_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/dashboard',
		icon: <FaThLarge />
	},
	{
		key: 'products',
		label: 'Profile',
		path: '/dashboard/profile',
		icon: <FaUserCircle />
	},
	{
		key: 'attendance',
		label: 'Attendance',
		path: '/dashboard/attendance',
		icon: <FaClipboardList />
	},
	{
		key: 'academic-goals',
		label: 'Academic Goals',
		icon: <FaChartLine />,
		subLinks: [
			{
				label: 'Set New Goal',
				path: '/dashboard/set-acad-goals'
			},
			{
				label: 'View All Goals',
				path: '/dashboard/view-acad-goals'
			},
			{
				label: 'Edit Goals',
				path: '/dashboard/all-acad-goals'
			}
		]
	},
	{
		key: 'assignments',
		label: 'Assignments',
		path: '/dashboard/all-assignments',
		icon: <FaTasks />,
		
	},
	{
		key: 'timetable',
		label: 'Timetable',
		path: '/dashboard/timetable',
		icon: <FaCalendarAlt />
	}
];

export const FACULTY_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/dashboard',
		icon: <FaThLarge />
	},
	{
		key: 'profile',
		label: 'Profile',
		path: '/dashboard/profile',
		icon: <FaUserCircle />
	},
	{
		key: 'students',
		label: 'Students',
		path: '/dashboard/students',
		icon: <FaUserGraduate />
	},
	{
		key: 'attendance',
		label: 'Attendance',
		path: '/dashboard/faculty/take-attendance',
		icon: <FaClipboardList />
	},
	{
		key: 'assignments',
		label: 'Assignments',
		path: '/dashboard/faculty/upload-assignment',
		icon: <FaTasks />,
		
	},
	{
		key: 'timetable',
		label: 'Timetable',
		path: '/dashboard/timetable',
		icon: <FaCalendarAlt />
	}
];

export const USER_SIDEBAR_BOTTOM_LINKS = [
	{
		key: 'settings',
		label: 'Settings',
		path: '/dashboard/settings',
		icon: <FaCog />
	},
	{
		key: 'support',
		label: 'Help & Support',
		path: '/dashboard/contact',
		icon: <FaQuestionCircle />
	}
];
