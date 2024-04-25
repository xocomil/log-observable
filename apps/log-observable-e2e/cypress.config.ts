import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run log-observable:serve:development',
        production: 'nx run log-observable:serve:production',
      },
      ciWebServerCommand: 'nx run log-observable:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
