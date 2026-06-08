import { motion } from "framer-motion";
import { useData } from "@/contexts/DataContext";
import { configured } from "@/lib/firebase";

const TeamSection = () => {
  const { teamMembers, loading } = useData();
  return (
    <section className="py-24 bg-white dark:bg-black-deep">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-gold text-sm tracking-[0.3em] uppercase font-body mb-3">The People Behind The Magic</p>
          <h2 className="font-heading text-3xl md:text-5xl text-gray-900 dark:text-cream mb-4">Meet Our Experts</h2>
          <div className="w-24 h-px bg-gold mx-auto" />
          {/* DEBUG — remove after fix */}
          <p className="text-xs text-gray-400 mt-4">
            firebase:{configured?"on":"off"} | loading:{loading?"yes":"no"} | members:{teamMembers.length} | first:{teamMembers[0]?.name ?? "none"}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.id}
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 mx-auto mb-4 md:mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-gold/30 group-hover:border-gold transition-colors duration-500" />
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover p-1"
                />
              </div>
              <div className="w-16 h-px bg-gold/40 mx-auto mb-4" />
              <h3 className="font-heading text-lg text-gray-900 dark:text-cream mb-1">{member.name}</h3>
              <p className="text-gold text-xs tracking-widest uppercase font-body mb-3">{member.role}</p>
              <p className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed px-2">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
