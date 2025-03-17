import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  gradientBackground: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 8,
  },
  sliderContainer: {
    marginBottom: 16,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  sliderValue: {
    fontSize: 14,
    color: '#60a5fa',
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  inputContainer: {
    marginTop: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 8,
    color: '#f8fafc',
    fontSize: 16,
  },
  quantizationContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  quantButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  quantButtonActive: {
    backgroundColor: '#3b82f6',
  },
  quantButtonText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  quantButtonTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: '#cbd5e1',
  },
  kvCacheOptions: {
    marginTop: 16,
  },
  memoryModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  memoryModeButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  memoryModeButtonActive: {
    backgroundColor: '#3b82f6',
  },
  memoryModeText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  memoryModeTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  vramContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  vramButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  vramButtonActive: {
    backgroundColor: '#3b82f6',
  },
  vramButtonText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  vramButtonTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  resultLabel: {
    fontSize: 16,
    color: '#cbd5e1',
  },
  resultValue: {
    fontSize: 16,
    color: '#f8fafc',
    fontWeight: '500',
  },
  resultHighlight: {
    fontSize: 18,
    color: '#60a5fa',
    fontWeight: 'bold',
  },
  statusBox: {
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  statusSuccess: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  statusWarning: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
  },
  statusTextSuccess: {
    color: '#4ade80',
    fontSize: 14,
    textAlign: 'center',
  },
  statusTextWarning: {
    color: '#fde047',
    fontSize: 14,
    textAlign: 'center',
  },
  utilizationContainer: {
    marginTop: 16,
  },
  utilizationBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  utilizationFill: {
    height: '100%',
    borderRadius: 4,
  },
  utilizationlow: {
    backgroundColor: '#4ade80',
  },
  utilizationmedium: {
    backgroundColor: '#facc15',
  },
  utilizationhigh: {
    backgroundColor: '#fb923c',
  },
  utilizationextreme: {
    backgroundColor: '#ef4444',
  },
  utilizationLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  utilizationLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  complexityContainer: {
    marginTop: 24,
  },
  complexityTitle: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 8,
  },
  complexityBox: {
    padding: 12,
    borderRadius: 8,
  },
  complexitytiny: {
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
  },
  complexitysmall: {
    backgroundColor: 'rgba(250, 204, 21, 0.2)',
  },
  complexitymedium: {
    backgroundColor: 'rgba(251, 146, 60, 0.2)',
  },
  complexitylarge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  complexityxlarge: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
  },
  complexitymassive: {
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
  },
  complexityTexttiny: {
    color: '#4ade80',
    textAlign: 'center',
  },
  complexityTextsmall: {
    color: '#facc15',
    textAlign: 'center',
  },
  complexityTextmedium: {
    color: '#fb923c',
    textAlign: 'center',
  },
  complexityTextlarge: {
    color: '#ef4444',
    textAlign: 'center',
  },
  complexityTextxlarge: {
    color: '#a855f7',
    textAlign: 'center',
  },
  complexityTextmassive: {
    color: '#ec4899',
    textAlign: 'center',
  },
  // Welcome screen specific styles
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 16,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orb: {
    position: 'absolute',
    borderRadius: 150,
    opacity: 0.6,
  },
  orb1: {
    width: 300,
    height: 300,
    backgroundColor: '#3b82f6',
    top: '10%',
    left: '10%',
  },
  orb2: {
    width: 200,
    height: 200,
    backgroundColor: '#8b5cf6',
    bottom: '20%',
    right: '15%',
  },
  orb3: {
    width: 150,
    height: 150,
    backgroundColor: '#6366f1',
    top: '40%',
    right: '25%',
  },
  section: {
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginLeft: 8,
  },
  utilizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  utilizationValue: {
    fontSize: 16,
    color: '#60a5fa',
    fontWeight: 'bold',
  },
  utilizationBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  utilizationPercentage: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'right',
  },
  storageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  storageLabel: {
    fontSize: 16,
    color: '#cbd5e1',
  },
  storageValue: {
    fontSize: 16,
    color: '#f8fafc',
    fontWeight: '500',
  },
  gpuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gpuLabel: {
    fontSize: 16,
    color: '#cbd5e1',
  },
  gpuValue: {
    fontSize: 16,
    color: '#f8fafc',
    fontWeight: '500',
  },
  memoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  memoryLabel: {
    fontSize: 16,
    color: '#cbd5e1',
  },
  memoryValue: {
    fontSize: 16,
    color: '#f8fafc',
    fontWeight: '500',
  },
}); 