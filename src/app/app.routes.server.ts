import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'garage-form/:carId', renderMode: RenderMode.Client },
  { path: 'current-car/:carId', renderMode: RenderMode.Client },
  { path: 'insurance/:carId', renderMode: RenderMode.Client },
  { path: 'insurance/:carId/:insuranceId', renderMode: RenderMode.Client },
  { path: 'insurance-form/:carId', renderMode: RenderMode.Client },
  { path: 'insurance-form/:carId/:insuranceId', renderMode: RenderMode.Client },
  { path: 'fuel/:carId', renderMode: RenderMode.Client },
  { path: 'fuel-details/:fuelId', renderMode: RenderMode.Client },
  { path: 'fuel-form', renderMode: RenderMode.Client },
  { path: 'fuel-form/:carId', renderMode: RenderMode.Client },
  { path: 'fuel-form/:fuelId', renderMode: RenderMode.Client },
  { path: 'car/:carId/fuel', renderMode: RenderMode.Client },
  { path: 'car/:carId/fuel-details/:fuelId', renderMode: RenderMode.Client },
  { path: 'car/:carId/fuel-form', renderMode: RenderMode.Client },
  { path: 'car/:carId/fuel-form/:fuelId', renderMode: RenderMode.Client },
  { path: 'notes', renderMode: RenderMode.Client },
  { path: 'notes/:carId', renderMode: RenderMode.Client },
  { path: 'notes-details/:carId/:noteId', renderMode: RenderMode.Client },
  { path: 'notes-form', renderMode: RenderMode.Client },
  { path: 'notes-form/:noteId', renderMode: RenderMode.Client },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
