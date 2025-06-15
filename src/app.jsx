import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Pill, AlertCircle, Apple, MessageCircle, Home, Baby, ChevronRight, Send, X, Search, Heart, Activity, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

// Knowledge Graph Data
const knowledgeGraph = {
  pregnancyKnowledgeGraph: {
    nutritionalRequirements: {
      dailyMacros: [
        { nutrient: "Folic Acid", amount: "600-800", unit: "mcg", category: "vitamin" },
        { nutrient: "Calcium", amount: "1000-2500", unit: "mg", category: "mineral" },
        { nutrient: "Protein", amount: "88", unit: "gm", category: "macronutrient" },
        { nutrient: "Iron", amount: "27", unit: "mg", category: "mineral" },
        { nutrient: "Vitamin D", amount: "600", unit: "IUs", category: "vitamin" }
      ],
      weightGainRecommendations: [
        { prePregnancyBMI: "Underweight", bmiRange: "<18.5", recommendedGain: "28-40", unit: "pounds" },
        { prePregnancyBMI: "Healthy weight", bmiRange: "18.5-24.9", recommendedGain: "25-35", unit: "pounds" },
        { prePregnancyBMI: "Overweight", bmiRange: "25-29.9", recommendedGain: "15-25", unit: "pounds" },
        { prePregnancyBMI: "Obese", bmiRange: "≥30", recommendedGain: "11-20", unit: "pounds" }
      ]
    },
    foodSafety: {
      seafoodGuidelines: {
        safe: ["Rawas"],
        unsafe: ["Bangda", "Pamplet", "Surmai", "Katla", "Rohu", "Swordfish", "Tilefish", "Tuna (bigeye, albacore)", "Mori", "Waghbeer"]
      },
      avoidFoods: [
        { item: "Non-pasteurized dairy", includes: ["home made yogurt"] },
        { item: "Caffeine", includes: ["Tea", "carbonated beverages", "cocoa", "chocolate"] },
        { item: "Vitamin A supplements", details: "Avoid preformed vitamin A (retinol)" }
      ]
    },
    morningSicknessManagement: {
      whatToEat: ["Bland, dry foods", "Protein-rich foods", "Ginger-based foods"],
      avoidFoods: ["Greasy foods", "Spicy foods", "Fatty foods"],
      eatingTips: ["Eat crackers before getting up", "Snack often", "Don't let stomach go empty"],
      hydrationTips: ["Sip water or ginger ale", "Suck on ice chips"]
    },
    pregnancyTimeline: {
      weeks9to12: {
        trimester: "First",
        title: "Third Month: Nearing End of First Trimester",
        commonSymptoms: [
          { symptom: "Morning sickness", status: "Peaks now, eases by weeks 13-14" },
          { symptom: "Fatigue & dizziness", status: "Heart working harder" },
          { symptom: "Breast soreness", status: "Body growing and stretching" },
          { symptom: "Frequent urination", status: "Uterus pressing on bladder" }
        ],
        exercise: {
          name: "Side plank",
          benefits: "Strengthens core muscles",
          instructions: ["Lie on side", "Raise onto forearm", "Hold position", "Repeat 5-10 times"]
        }
      },
      weeks13to16: {
        trimester: "Second",
        title: "Golden Period - Second Trimester Begins",
        commonSymptoms: [
          { symptom: "Energy returning", status: "Nausea and fatigue easing" },
          { symptom: "Nasal congestion", status: "Increased blood flow" },
          { symptom: "Skin changes", status: "Darker patches may appear" },
          { symptom: "Belly growth", status: "May start showing" }
        ],
        exercise: {
          name: "Back press",
          benefits: "Supports good posture",
          instructions: ["Stand against wall", "Press lower back to wall", "Hold several seconds", "Repeat 5-10 times"]
        }
      }
    },
    symptomTroubleshooting: {
      categories: [
        {
          category: "Vaginal Bleeding/Discharge",
          symptoms: [
            { sign: "Slight spotting < 1 day", urgency: "Within 24 hrs", action: "Monitor", severity: "low" },
            { sign: "Heavy bleeding", urgency: "Immediately", action: "Emergency", severity: "high" },
            { sign: "Green/yellow discharge", urgency: "Within 24 hrs", action: "Infection risk", severity: "medium" }
          ]
        },
        {
          category: "Pain",
          symptoms: [
            { sign: "Mild cramping", urgency: "Next visit", action: "Common", severity: "low" },
            { sign: "Severe headache with vision changes", urgency: "Immediately", action: "Emergency", severity: "high" },
            { sign: "Leg pain with swelling", urgency: "Immediately", action: "Blood clot risk", severity: "high" }
          ]
        },
        {
          category: "Other Symptoms",
          symptoms: [
            { sign: "Fever < 102°F", urgency: "Within 24 hrs", action: "Monitor", severity: "medium" },
            { sign: "Fever ≥ 102°F", urgency: "Immediately", action: "High risk", severity: "high" },
            { sign: "Sudden face/hand swelling", urgency: "Same day", action: "Preeclampsia sign", severity: "high" }
          ]
        }
      ]
    },
    medications: {
      byCondition: [
        {
          condition: "Pain and Fever",
          medications: [
            { drug: "Acetaminophen", brand: "Tylenol", safety: "🟢", safetyLevel: "Generally Safe" },
            { drug: "Ibuprofen", brand: "Advil", safety: "🟡", safetyLevel: "Use with Caution", note: "Only 1st/2nd trimester" },
            { drug: "Aspirin", safety: "🔴", safetyLevel: "Avoid", note: "Unless directed by doctor" }
          ]
        },
        {
          condition: "Allergies/Cold",
          medications: [
            { drug: "Cetirizine", brand: "Zyrtec", safety: "🟢", safetyLevel: "Generally Safe" },
            { drug: "Loratadine", brand: "Claritin", safety: "🟢", safetyLevel: "Generally Safe" },
            { drug: "Pseudoephedrine", brand: "Sudafed", safety: "🟡", safetyLevel: "Use with Caution", note: "Avoid 1st trimester" }
          ]
        },
        {
          condition: "Heartburn",
          medications: [
            { drug: "Calcium carbonate", brand: "Tums", safety: "🟢", safetyLevel: "Generally Safe" },
            { drug: "Famotidine", brand: "Pepcid", safety: "🟢", safetyLevel: "Generally Safe" }
          ]
        }
      ]
    }
  }
};

// Knowledge Base Class
class PregnancyKnowledgeBase {
  constructor(data) {
    this.data = data.pregnancyKnowledgeGraph;
  }

  getWeekInfo(week) {
    if (week >= 9 && week <= 12) return this.data.pregnancyTimeline.weeks9to12;
    if (week >= 13 && week <= 16) return this.data.pregnancyTimeline.weeks13to16;
    return null;
  }

  checkMedicationSafety(medName) {
    const results = [];
    this.data.medications.byCondition.forEach(condition => {
      condition.medications.forEach(med => {
        if (med.drug.toLowerCase().includes(medName.toLowerCase()) ||
            (med.brand && med.brand.toLowerCase().includes(medName.toLowerCase()))) {
          results.push({ ...med, condition: condition.condition });
        }
      });
    });
    return results;
  }

  getSymptomInfo(symptom) {
    const results = [];
    this.data.symptomTroubleshooting.categories.forEach(cat => {
      cat.symptoms.forEach(s => {
        if (s.sign.toLowerCase().includes(symptom.toLowerCase())) {
          results.push({ ...s, category: cat.category });
        }
      });
    });
    return results;
  }

  getEmergencySymptoms() {
    const emergencies = [];
    this.data.symptomTroubleshooting.categories.forEach(cat => {
      cat.symptoms.forEach(s => {
        if (s.severity === 'high') {
          emergencies.push({ ...s, category: cat.category });
        }
      });
    });
    return emergencies;
  }

  getNutritionalRequirements() {
    return this.data.nutritionalRequirements;
  }

  processChat(input) {
    const lower = input.toLowerCase();
    
    // Week queries
    const weekMatch = lower.match(/week\s*(\d+)/);
    if (weekMatch) {
      const week = parseInt(weekMatch[1]);
      const info = this.getWeekInfo(week);
      if (info) {
        return `Week ${week} (${info.trimester} Trimester): ${info.title}\n\nCommon symptoms:\n${info.commonSymptoms.map(s => `• ${s.symptom}: ${s.status}`).join('\n')}`;
      }
    }
    
    // Medication queries
    if (lower.includes('tylenol') || lower.includes('advil') || lower.includes('medication')) {
      const medMatch = lower.match(/(?:is|can i take)\s+(\w+)/);
      if (medMatch) {
        const results = this.checkMedicationSafety(medMatch[1]);
        if (results.length > 0) {
          const med = results[0];
          return `${med.drug} (${med.brand}): ${med.safetyLevel} ${med.safety}\n${med.note ? `Note: ${med.note}` : ''}`;
        }
      }
    }
    
    // Symptom queries
    if (lower.includes('bleeding') || lower.includes('pain') || lower.includes('fever')) {
      const symptoms = this.getSymptomInfo(lower);
      if (symptoms.length > 0) {
        const s = symptoms[0];
        return `${s.sign}:\n• Action: ${s.action}\n• Contact provider: ${s.urgency}\n• Category: ${s.category}`;
      }
    }
    
    // Nutrition queries
    if (lower.includes('nutrition') || lower.includes('vitamin') || lower.includes('diet')) {
      const nutrients = this.data.nutritionalRequirements.dailyMacros;
      return `Daily Nutritional Requirements:\n${nutrients.map(n => `• ${n.nutrient}: ${n.amount} ${n.unit}`).join('\n')}`;
    }
    
    return "I can help with pregnancy questions about weeks, symptoms, medications, and nutrition. Try asking about specific weeks (e.g., 'week 12'), medications (e.g., 'can I take Tylenol'), or symptoms.";
  }
}

// Main App Component
export default function PregnancyTrackerApp() {
  const [kb] = useState(() => new PregnancyKnowledgeBase(knowledgeGraph));
  const [activeTab, setActiveTab] = useState('home');
  const [dueDate, setDueDate] = useState(() => {
    const saved = localStorage.getItem('pregnancyDueDate');
    return saved ? saved : '';
  });
  const [modalVersion, setModalVersion] = useState(() => {
    const saved = localStorage.getItem('pregnancyDueDate');
    return (!saved || saved === '') ? 1 : 0;
  });
  const showDueDateModal = modalVersion > 0;
  
  const [currentWeek, setCurrentWeek] = useState(() => {
    const saved = localStorage.getItem('pregnancyDueDate');
    if (!saved) return 12;
    const today = new Date();
    const due = new Date(saved);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeksRemaining = Math.floor(diffDays / 7);
    return Math.max(1, Math.min(40, 40 - weeksRemaining));
  });
  const [medicationSearch, setMedicationSearch] = useState('');
  const [symptomSearch, setSymptomSearch] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your pregnancy assistant. Ask me about symptoms, medications, nutrition, or anything pregnancy-related!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    console.log('Modal version changed:', modalVersion, 'showModal:', showDueDateModal);
  }, [modalVersion, showDueDateModal]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (dueDate) {
      const today = new Date();
      const due = new Date(dueDate);
      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weeksRemaining = Math.floor(diffDays / 7);
      const calculatedWeek = Math.max(1, Math.min(40, 40 - weeksRemaining));
      setCurrentWeek(calculatedWeek);
    }
  }, [dueDate]);

  const handleDueDateSubmit = (e) => {
    e.preventDefault();
    const inputDate = e.target.dueDate.value;
    if (inputDate) {
      setDueDate(inputDate);
      localStorage.setItem('pregnancyDueDate', inputDate);
      setModalVersion(0);
      
      // Calculate and update the current week
      const today = new Date();
      const due = new Date(inputDate);
      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weeksRemaining = Math.floor(diffDays / 7);
      const calculatedWeek = Math.max(1, Math.min(40, 40 - weeksRemaining));
      setCurrentWeek(calculatedWeek);
    }
  };

  const weekInfo = kb.getWeekInfo(currentWeek);
  const emergencySymptoms = kb.getEmergencySymptoms();
  const nutritionalReqs = kb.getNutritionalRequirements();

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMessage = { role: 'user', content: chatInput };
    const response = kb.processChat(chatInput);
    const assistantMessage = { role: 'assistant', content: response };
    
    setChatMessages(prev => [...prev, userMessage, assistantMessage]);
    setChatInput('');
  };

  const renderHome = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-2">Welcome to Your Pregnancy Journey</h2>
        <p className="text-gray-700">Currently tracking: Week {currentWeek}</p>
        {dueDate && (
          <p className="text-sm text-gray-600 mt-1">
            Due Date: {new Date(dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Baby className="w-8 h-8 text-purple-600" />
            <div>
              <p className="font-semibold">{weekInfo?.title || 'Your Pregnancy Progress'}</p>
              <p className="text-sm text-gray-600">{weekInfo?.trimester || 'First'} Trimester</p>
            </div>
          </div>
          <button
            onClick={() => setModalVersion(prev => prev + 1)}
            className="px-3 py-1 text-sm text-purple-600 hover:text-purple-800 underline cursor-pointer"
            type="button"
          >
            Update Due Date
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setActiveTab('tracker')}
          className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
        >
          <Calendar className="w-8 h-8 text-blue-500 mb-2" />
          <h3 className="font-semibold">Week Tracker</h3>
          <p className="text-sm text-gray-600">Track your progress</p>
        </button>

        <button
          onClick={() => setActiveTab('medications')}
          className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
        >
          <Pill className="w-8 h-8 text-green-500 mb-2" />
          <h3 className="font-semibold">Medications</h3>
          <p className="text-sm text-gray-600">Check safety</p>
        </button>

        <button
          onClick={() => setActiveTab('symptoms')}
          className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
        >
          <Activity className="w-8 h-8 text-orange-500 mb-2" />
          <h3 className="font-semibold">Symptoms</h3>
          <p className="text-sm text-gray-600">Track & understand</p>
        </button>

        <button
          onClick={() => setActiveTab('nutrition')}
          className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
        >
          <Apple className="w-8 h-8 text-red-500 mb-2" />
          <h3 className="font-semibold">Nutrition</h3>
          <p className="text-sm text-gray-600">Daily requirements</p>
        </button>
      </div>

      <div className="bg-red-50 p-4 rounded-xl border border-red-200">
        <h3 className="font-semibold text-red-800 mb-2 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Quick Emergency Reference
        </h3>
        <p className="text-sm text-red-700 mb-2">Seek immediate help for:</p>
        <ul className="text-sm space-y-1">
          {emergencySymptoms.slice(0, 3).map((s, i) => (
            <li key={i} className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>{s.sign}</span>
            </li>
          ))}
        </ul>
        <button 
          onClick={() => setActiveTab('emergency')}
          className="text-red-600 text-sm mt-2 underline"
        >
          View all emergency symptoms →
        </button>
      </div>
    </div>
  );

  const renderTracker = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Pregnancy Week Tracker</h2>
        
        <div className="mb-6">
          <div className="bg-purple-50 p-4 rounded-lg mb-4">
            <p className="text-purple-900 font-medium">
              Based on your due date: {dueDate ? new Date(dueDate).toLocaleDateString() : 'Not set'}
            </p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              You are currently in Week {currentWeek}
            </p>
          </div>
        </div>

        {weekInfo ? (
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">{weekInfo.title}</h3>
              <p className="text-purple-700">{weekInfo.trimester} Trimester</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Common Symptoms</h4>
              <div className="space-y-2">
                {weekInfo.commonSymptoms.map((symptom, i) => (
                  <div key={i} className="flex items-start bg-gray-50 p-3 rounded-lg">
                    <Heart className="w-5 h-5 text-pink-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">{symptom.symptom}</p>
                      <p className="text-sm text-gray-600">{symptom.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {weekInfo.exercise && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Recommended Exercise: {weekInfo.exercise.name}
                </h4>
                <p className="text-sm text-blue-700 mb-2">{weekInfo.exercise.benefits}</p>
                <ul className="text-sm space-y-1">
                  {weekInfo.exercise.instructions.map((inst, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {inst}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Baby className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Detailed information for week {currentWeek} coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderMedications = () => {
    const searchResults = medicationSearch ? kb.checkMedicationSafety(medicationSearch) : [];
    
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">Medication Safety Checker</h2>
          
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search medication (e.g., Tylenol, Advil)"
                value={medicationSearch}
                onChange={(e) => setMedicationSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-3">
              {searchResults.map((med, i) => (
                <div key={i} className={`p-4 rounded-lg border ${
                  med.safety === '🟢' ? 'bg-green-50 border-green-200' :
                  med.safety === '🟡' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{med.drug}</h4>
                      <p className="text-sm text-gray-600">Brand: {med.brand || 'Generic'}</p>
                      <p className="text-sm text-gray-600">For: {med.condition}</p>
                      <p className="mt-2 font-medium flex items-center">
                        <span className="text-2xl mr-2">{med.safety}</span>
                        {med.safetyLevel}
                      </p>
                      {med.note && (
                        <p className="text-sm mt-1 text-gray-700">Note: {med.note}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8">
            <h3 className="font-semibold mb-3">Common Medications by Category</h3>
            {knowledgeGraph.pregnancyKnowledgeGraph.medications.byCondition.map((cat, i) => (
              <div key={i} className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">{cat.condition}</h4>
                <div className="grid grid-cols-1 gap-2">
                  {cat.medications.map((med, j) => (
                    <div key={j} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{med.drug} ({med.brand})</span>
                      <span className="text-xl">{med.safety}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSymptoms = () => {
    const symptomResults = symptomSearch ? kb.getSymptomInfo(symptomSearch) : [];
    
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">Symptom Tracker</h2>
          
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Describe your symptom (e.g., bleeding, pain, fever)"
                value={symptomSearch}
                onChange={(e) => setSymptomSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {symptomResults.length > 0 && (
            <div className="space-y-3 mb-6">
              {symptomResults.map((symptom, i) => (
                <div key={i} className={`p-4 rounded-lg border ${
                  symptom.severity === 'high' ? 'bg-red-50 border-red-200' :
                  symptom.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-green-50 border-green-200'
                }`}>
                  <h4 className="font-semibold">{symptom.sign}</h4>
                  <p className="text-sm text-gray-600">Category: {symptom.category}</p>
                  <p className="mt-2">
                    <span className="font-medium">Action:</span> {symptom.action}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Contact provider:</span> {symptom.urgency}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-3">All Symptoms by Category</h3>
            {knowledgeGraph.pregnancyKnowledgeGraph.symptomTroubleshooting.categories.map((cat, i) => (
              <div key={i} className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">{cat.category}</h4>
                <div className="space-y-2">
                  {cat.symptoms.map((symptom, j) => (
                    <div key={j} className="flex items-start p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-1.5 mr-3 ${
                        symptom.severity === 'high' ? 'bg-red-500' :
                        symptom.severity === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{symptom.sign}</p>
                        <p className="text-xs text-gray-600">{symptom.action} • {symptom.urgency}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderNutrition = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Nutrition Planner</h2>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Daily Nutritional Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {nutritionalReqs.dailyMacros.map((nutrient, i) => (
              <div key={i} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{nutrient.nutrient}</h4>
                    <p className="text-sm text-gray-600 capitalize">{nutrient.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-purple-600">{nutrient.amount}</p>
                    <p className="text-sm text-gray-600">{nutrient.unit}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-red-900 mb-2">Foods to Avoid</h3>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-red-800 mb-1">Unsafe Seafood (High Mercury)</h4>
              <p className="text-sm text-red-700">
                {knowledgeGraph.pregnancyKnowledgeGraph.foodSafety.seafoodGuidelines.unsafe.join(', ')}
              </p>
            </div>
            <div className="space-y-2">
              {knowledgeGraph.pregnancyKnowledgeGraph.foodSafety.avoidFoods.map((food, i) => (
                <div key={i} className="text-sm">
                  <span className="font-medium text-red-800">{food.item}</span>
                  {food.includes && (
                    <span className="text-red-700"> - includes {food.includes.join(', ')}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">Morning Sickness Tips</h3>
          <div className="space-y-2 text-sm">
            <div>
              <p className="font-medium text-green-800">What to Eat:</p>
              <p className="text-green-700">{knowledgeGraph.pregnancyKnowledgeGraph.morningSicknessManagement.whatToEat.join(', ')}</p>
            </div>
            <div>
              <p className="font-medium text-green-800">Foods to Avoid:</p>
              <p className="text-green-700">{knowledgeGraph.pregnancyKnowledgeGraph.morningSicknessManagement.avoidFoods.join(', ')}</p>
            </div>
            <div>
              <p className="font-medium text-green-800">Eating Tips:</p>
              <ul className="text-green-700 ml-4">
                {knowledgeGraph.pregnancyKnowledgeGraph.morningSicknessManagement.eatingTips.map((tip, i) => (
                  <li key={i} className="list-disc">{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmergency = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-red-600 flex items-center">
          <AlertTriangle className="w-8 h-8 mr-2" />
          Emergency Symptoms Guide
        </h2>
        
        <div className="bg-red-50 p-4 rounded-lg mb-6 border border-red-200">
          <p className="text-red-800 font-semibold mb-2">
            Seek immediate medical attention for any of these symptoms:
          </p>
        </div>

        <div className="space-y-3">
          {emergencySymptoms.map((symptom, i) => (
            <div key={i} className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-red-600 mr-3 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900">{symptom.sign}</h4>
                  <p className="text-sm text-red-700 mt-1">Category: {symptom.category}</p>
                  <p className="text-sm text-red-700">Action: {symptom.action}</p>
                  <p className="font-medium text-red-800 mt-2">
                    Contact provider: {symptom.urgency}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Emergency Contacts</h3>
          <p className="text-sm text-blue-800">Keep these numbers handy:</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Your OB/GYN: _______________</li>
            <li>• Hospital L&D: _______________</li>
            <li>• Emergency: 911</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold flex items-center">
          <MessageCircle className="w-6 h-6 mr-2" />
          Pregnancy Assistant
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      
      <form onSubmit={handleChatSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask about symptoms, medications, or pregnancy..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Baby className="w-8 h-8 mr-2 text-purple-600" />
            Pregnancy Care Companion
          </h1>
          <p className="text-gray-600 mt-1">Your complete pregnancy tracking and health guide</p>
        </header>

        {/* Main Content */}
        <div className="pb-20">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'tracker' && renderTracker()}
          {activeTab === 'medications' && renderMedications()}
          {activeTab === 'symptoms' && renderSymptoms()}
          {activeTab === 'nutrition' && renderNutrition()}
          {activeTab === 'emergency' && renderEmergency()}
          {activeTab === 'chat' && (
            <div className="h-[600px]">
              {renderChat()}
            </div>
          )}
        </div>

        {/* Due Date Modal */}
        {showDueDateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Update Due Date</h3>
                <button 
                  onClick={() => setModalVersion(0)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleDueDateSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter your due date:
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    required
                    className="w-full p-2 border rounded-lg"
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                >
                  Save Due Date
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex justify-around py-2">
              <button
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center p-2 ${
                  activeTab === 'home' ? 'text-purple-600' : 'text-gray-500'
                }`}
              >
                <Home className="w-6 h-6" />
                <span className="text-xs mt-1">Home</span>
              </button>
              
              <button
                onClick={() => setActiveTab('tracker')}
                className={`flex flex-col items-center p-2 ${
                  activeTab === 'tracker' ? 'text-purple-600' : 'text-gray-500'
                }`}
              >
                <Calendar className="w-6 h-6" />
                <span className="text-xs mt-1">Tracker</span>
              </button>
              
              <button
                onClick={() => setActiveTab('medications')}
                className={`flex flex-col items-center p-2 ${
                  activeTab === 'medications' ? 'text-purple-600' : 'text-gray-500'
                }`}
              >
                <Pill className="w-6 h-6" />
                <span className="text-xs mt-1">Meds</span>
              </button>
              
              <button
                onClick={() => setActiveTab('emergency')}
                className={`flex flex-col items-center p-2 ${
                  activeTab === 'emergency' ? 'text-purple-600' : 'text-gray-500'
                }`}
              >
                <AlertCircle className="w-6 h-6" />
                <span className="text-xs mt-1">Emergency</span>
              </button>
              
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex flex-col items-center p-2 ${
                  activeTab === 'chat' ? 'text-purple-600' : 'text-gray-500'
                }`}
              >
                <MessageCircle className="w-6 h-6" />
                <span className="text-xs mt-1">Chat</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}