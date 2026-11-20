# Mock UX — Healthcare Clinic Patient History System

This wireframe is intentionally low-fidelity and follows the supplied Mock UX LU: layout, navigation, user flow, information hierarchy, user actions, empty states, and error states are described before implementation.

## Primary user
Clinic staff who need to retrieve a patient's existing treatment history and maintain patient records.

## User flow

```text
LOGIN
  |
  v
DASHBOARD / PATIENT LIST
  | \
  |  \--> ADD PATIENT --> PATIENT DETAILS
  |
  v
PATIENT DETAILS
  |
  +--> View complete treatment history
  |
  +--> Add treatment record
  |
  +--> Edit treatment record
  |
  +--> Delete treatment record
  |
  +--> Edit patient
  |
  +--> Delete patient
```

## Screen 1 — Login
Purpose: authenticate a clinic user with username and password before protected patient information is shown.

Elements:
- Username
- Password
- Login action
- Register action
- Authentication error state

## Screen 2 — Patient Dashboard
Purpose: provide the first view of patient records.

Elements:
- Header
- Navigation
- Search patients
- Patient table
- View History action
- Delete action
- Empty state when no patient matches the search
- Loading/error state

Information hierarchy:
1. Patient list
2. Search
3. Row actions

## Screen 3 — Add Patient
Purpose: create a patient record.

Fields:
- Name
- Date of birth
- Phone
- Email
- Gender
- Address
- Save Patient action
- Validation/error state

## Screen 4 — Patient Details
Purpose: provide the complete treatment history for one patient.

Elements:
- Patient identity/contact information
- Edit Patient action
- Treatment History section
- Add Treatment Record form
- Existing treatment records
- Edit/Delete treatment actions
- Empty history state
- Error state

The main workflow is summary/detail: identify the patient first, then inspect the linked treatment records.

## Screen 5 — Edit Patient
Purpose: update existing patient information using the PUT API.

## Design reasoning
The patient list is the main entry point because the core problem is retrieving an existing patient's information quickly. The patient details screen puts the treatment history directly with the patient rather than making the user navigate through unrelated screens. CRUD actions are attached to the relevant entity so the user can update or delete the record being viewed.

## States represented
- Loading
- Empty patient list
- No search matches
- Empty treatment history
- Authentication error
- API/database error
- Successful CRUD flow
