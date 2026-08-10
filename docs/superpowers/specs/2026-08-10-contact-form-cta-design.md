# Contact form CTA design

## Goal

Make the home-page hero call to action accurately describe its destination and take visitors directly to the contact form.

## Changes

- Change the Polish hero CTA label from `CENNIK I DOSTĘPNOŚĆ` to `ZAPYTAJ O CENNIK I DOSTĘPNOŚĆ`.
- Change the hero CTA destination from the contact-page root to `/kontakt#formularz`.
- Add the stable `formularz` fragment identifier to the contact-form section.
- Add scroll margin to that section so the fixed header does not cover the beginning of the form after fragment navigation.

## Scope

Only the home-page hero CTA and the contact-form section are affected. Other availability and contact buttons keep their current labels and destinations.

## Implementation notes

Use native URL-fragment navigation rather than client-side scrolling code. Keep the existing shared button component and translation structure unchanged.

## Verification

- Confirm the relevant source references use the new label, destination, and matching section ID.
- Run the project's existing focused static checks or test suite appropriate for the changed files.
- Confirm no unrelated CTA labels or targets changed.
