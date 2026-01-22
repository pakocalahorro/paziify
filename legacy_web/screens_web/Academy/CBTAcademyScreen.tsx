import React from 'react';
import { ArrowLeft, Star, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Screen, Course } from '../../types';

const courses: Course[] = [
    { id: 'c1', title: 'Neurobiología del Estrés', author: 'Dr. A. Castillo', duration: '4 Semanas', level: 'Clínico', isPlus: true, progress: 40, image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=2631&auto=format&fit=crop' },
    { id: 'c2', title: 'Arquitectura del Sueño', author: 'Stanford Lab', duration: '2 Semanas', level: 'Protocolo', isPlus: true, progress: 0, image: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?q=80&w=2631&auto=format&fit=crop' },
    { id: 'c3', title: 'Protocolos de Foco', author: 'Dra. S. Mendez', duration: '3 Semanas', level: 'Cognitivo', isPlus: true, progress: 15, image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop' },
];

const CBTAcademyScreen: React.FC = () => {
  const { navigate, userState, setShowUpsell, setSelectedCourse } = useApp();

  const handleCourseClick = (course: Course) => {
      if (course.isPlus && !userState.isPlusMember) {
          setShowUpsell(true);
      } else {
          setSelectedCourse(course);
          navigate(Screen.COURSE_DETAIL);
      }
  };

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto px-6 pt-6">
        <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate(Screen.LIBRARY)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center -ml-3">
                <ArrowLeft size={24}/>
            </button>
            <div>
                <div className="flex items-center gap-1 text-accent text-xs font-bold uppercase tracking-wider mb-1">
                    <Star size={12} className="fill-accent"/> Biblioteca Plus
                </div>
                <h1 className="text-2xl font-bold text-white leading-none">Academia de Resiliencia</h1>
            </div>
        </div>

        <div className="space-y-6">
            <div className="flex justify-between items-baseline">
                <h2 className="text-lg font-bold text-white">Cursos Destacados</h2>
                <span className="text-[10px] font-bold text-text-muted uppercase">Orden por Relevancia</span>
            </div>

            {courses.map(course => (
                <div 
                    key={course.id}
                    onClick={() => handleCourseClick(course)}
                    className="bg-surface rounded-xl overflow-hidden border border-white/5 active:scale-[0.99] transition-transform cursor-pointer group"
                >
                    <div className="h-32 w-full relative">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded border border-accent/20 flex items-center gap-1 text-[10px] font-bold text-accent uppercase">
                            <Star size={10} className="fill-accent"/> PLUS
                        </div>
                        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white uppercase">
                            {course.duration}
                        </div>
                    </div>
                    <div className="p-4 pt-2">
                        <h3 className="text-lg font-bold text-white mb-1">{course.title}</h3>
                        <p className="text-xs text-text-muted mb-3 flex items-center gap-1">
                            <span className="w-4 h-4 rounded-full bg-white/10 block"></span> {course.author}
                        </p>
                        
                        <div className="flex gap-2 mb-3">
                             <span className="bg-white/5 px-2 py-1 rounded text-[10px] text-gray-300 border border-white/5 uppercase">{course.level}</span>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                                <span className={course.progress > 0 ? "text-primary font-bold" : "text-text-muted"}>
                                    {course.progress > 0 ? 'En curso' : 'Sin iniciar'}
                                </span>
                                <span className="text-text-muted">{course.progress}%</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${course.progress}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default CBTAcademyScreen;