/**
 * Test Data constants for OrangeHRM E2E tests
 */

export const Credentials = {
  ADMIN: {
    username: process.env.ADMIN_USERNAME || 'Admin',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  },
  INVALID: {
    username: 'InvalidUser',
    password: 'wrongPassword',
  },
  EMPTY: {
    username: '',
    password: '',
  },
};

export const URLs = {
  LOGIN: '/web/index.php/auth/login',
  DASHBOARD: '/web/index.php/dashboard/index',
  PIM: '/web/index.php/pim/viewEmployeeList',
  ADD_EMPLOYEE: '/web/index.php/pim/addEmployee',
  LEAVE_LIST: '/web/index.php/leave/viewLeaveList',
  LEAVE_ASSIGN: '/web/index.php/leave/assignLeave',
  LEAVE_APPLY: '/web/index.php/leave/applyLeave',
  DIRECTORY: '/web/index.php/directory/viewDirectory',
  MY_INFO: '/web/index.php/pim/viewMyDetails',
  ADMIN_USERS: '/web/index.php/admin/viewSystemUsers',
  BUZZ: '/web/index.php/buzz/viewBuzz',
  TIME: '/web/index.php/time/viewEmployeeTimesheet',
  TIME_MY: '/web/index.php/time/viewMyTimesheet',
  ATTENDANCE_MY: '/web/index.php/attendance/viewMyAttendanceRecord',
  ATTENDANCE_PUNCH: '/web/index.php/attendance/punchIn',
  RECRUITMENT: '/web/index.php/recruitment/viewCandidates',
  RECRUITMENT_VACANCIES: '/web/index.php/recruitment/viewJobVacancy',
  PERFORMANCE: '/web/index.php/performance/searchEvaluate',
  PERFORMANCE_TRACKERS: '/web/index.php/performance/myTrackerList',
  CLAIM: '/web/index.php/claim/assignClaim',
  CLAIM_SUBMIT: '/web/index.php/claim/submitClaim',
  CLAIM_MY: '/web/index.php/claim/viewClaim',
  MAINTENANCE: '/web/index.php/maintenance/purgeEmployee',
};

export const SidebarMenuItems = [
  'Admin',
  'PIM',
  'Leave',
  'Time',
  'Recruitment',
  'My Info',
  'Performance',
  'Dashboard',
  'Directory',
  'Maintenance',
  'Buzz',
  'Claim',
];

export const EmployeeData = {
  NEW_EMPLOYEE: {
    firstName: 'John',
    middleName: 'Michael',
    lastName: 'TestUser',
  },
  SEARCH_EMPLOYEE: {
    name: 'Paul',
  },
};

export const LeaveData = {
  LEAVE_TYPE: 'CAN - Vacation',
  FROM_DATE: '2027-01-15',
  TO_DATE: '2027-01-16',
};

export const DirectoryData = {
  JOB_TITLE: 'Chief Executive Officer',
  LOCATION: 'Canadian Regional HQ',
};
