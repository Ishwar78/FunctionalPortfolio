import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme, ThemeConfig } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Sun, Moon, Palette } from 'lucide-react';

const PRESET_COLORS = [
  { name: 'Cyan', primary: '195 100% 50%', secondary: '210 100% 55%' },
  { name: 'Blue', primary: '217 91% 60%', secondary: '221 83% 53%' },
  { name: 'Indigo', primary: '226 71% 56%', secondary: '243 51% 62%' },
  { name: 'Purple', primary: '259 84% 60%', secondary: '280 85% 56%' },
  { name: 'Pink', primary: '346 77% 57%', secondary: '333 71% 51%' },
  { name: 'Red', primary: '0 84% 60%', secondary: '358 79% 66%' },
  { name: 'Orange', primary: '25 95% 53%', secondary: '33 98% 56%' },
  { name: 'Green', primary: '142 71% 45%', secondary: '160 84% 39%' },
];

const AdminTheme = () => {
  const { theme, toggleMode, setColors } = useTheme();
  const [customPrimary, setCustomPrimary] = useState(theme.primaryColor);
  const [customSecondary, setCustomSecondary] = useState(theme.secondaryColor);

  const handleSaveColors = () => {
    setColors(customPrimary, customSecondary);
  };

  const handlePresetColor = (primary: string, secondary: string) => {
    setCustomPrimary(primary);
    setCustomSecondary(secondary);
    setColors(primary, secondary);
  };

  const previewStyle = {
    '--theme-primary': customPrimary,
    '--theme-secondary': customSecondary,
  } as React.CSSProperties;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Theme Customization</h1>
          <p className="text-muted-foreground mt-2">Personalize your portfolio's appearance</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Mode Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {theme.mode === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  Display Mode
                </CardTitle>
                <CardDescription>Light or Dark theme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant={theme.mode === 'light' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => {
                        if (theme.mode === 'dark') toggleMode();
                      }}
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </Button>
                    <Button
                      variant={theme.mode === 'dark' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => {
                        if (theme.mode === 'light') toggleMode();
                      }}
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Current: <strong>{theme.mode.charAt(0).toUpperCase() + theme.mode.slice(1)}</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Color Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Preview
                </CardTitle>
                <CardDescription>See your colors in action</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="space-y-3 p-4 rounded-lg border"
                  style={previewStyle}
                >
                  <div className="bg-primary/10 border border-primary rounded p-3">
                    <p className="text-primary font-semibold">Primary Color</p>
                  </div>
                  <div className="bg-accent/10 border border-accent rounded p-3">
                    <p className="text-accent font-semibold">Secondary Color</p>
                  </div>
                  <Button className="w-full">Preview Button</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Custom Colors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Custom Colors</CardTitle>
                <CardDescription>HSL format values</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Primary Color</label>
                  <input
                    type="text"
                    value={customPrimary}
                    onChange={(e) => setCustomPrimary(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md border-input bg-background"
                    placeholder="195 100% 50%"
                  />
                  <p className="text-xs text-muted-foreground mt-1">e.g., 195 100% 50%</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Secondary Color</label>
                  <input
                    type="text"
                    value={customSecondary}
                    onChange={(e) => setCustomSecondary(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md border-input bg-background"
                    placeholder="210 100% 55%"
                  />
                  <p className="text-xs text-muted-foreground mt-1">e.g., 210 100% 55%</p>
                </div>
                <Button onClick={handleSaveColors} className="w-full">
                  Save Custom Colors
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Preset Colors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Color Presets</CardTitle>
              <CardDescription>Choose from predefined color combinations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {PRESET_COLORS.map((preset) => (
                  <motion.button
                    key={preset.name}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handlePresetColor(preset.primary, preset.secondary)}
                    className="p-4 rounded-lg border-2 transition-all hover:shadow-lg"
                    style={{
                      borderColor: `hsl(${preset.primary})`,
                      backgroundColor: `hsl(${preset.primary} / 0.1)`,
                    }}
                  >
                    <div
                      className="w-full h-12 rounded mb-2 border-2"
                      style={{
                        borderColor: `hsl(${preset.primary})`,
                        backgroundColor: `hsl(${preset.primary})`,
                      }}
                    />
                    <div
                      className="w-full h-8 rounded border-2"
                      style={{
                        borderColor: `hsl(${preset.secondary})`,
                        backgroundColor: `hsl(${preset.secondary})`,
                      }}
                    />
                    <p className="text-sm font-medium mt-2">{preset.name}</p>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminTheme;
