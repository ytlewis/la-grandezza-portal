import { motion } from "framer-motion";
import team1 from "@/assets/team-1.jpg";
import team2 from "@/assets/team-2.jpg";
import team3 from "@/assets/team-3.jpg";
import team4 from "@/assets/team-4.jpg";
import team5 from "@/assets/team-5.jpg";

const team = [
  { name: "Amara Njeri", role: "Lead Wedding Planner", image: team1, bio: "With over 8 years creating dream weddings, Amara brings passion and precision to every celebration." },
  { name: "David Ochieng", role: "Corporate Events Director", image: team2, bio: "David orchestrates world-class corporate galas and conferences with strategic excellence." },
  { name: "Grace Wambui", role: "Creative Director", image: team3, bio: "Grace transforms spaces into breathtaking environments with her eye for design and detail." },
  { name: "James Kamau", role: "Operations Manager", image: team4, bio: "James ensures every event runs flawlessly from logistics to the final farewell." },
  { name: "Faith Muthoni", role: "Client Relations Manager", image: team5, bio: "Faith ensures every client feels heard, valued, and delighted throughout their journey." },
];

const TeamSection = () => (
  <section className="py-24 bg-black-deep">
    <div className="container mx-auto px-4 md:px-8">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="text-gold text-sm tracking-[0.3em] uppercase font-body mb-3">The People Behind The Magic</p>
        <h2 className="font-heading text-3xl md:text-5xl text-cream mb-4">Meet Our Experts</h2>
        <div className="w-24 h-px bg-gold mx-auto" />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {team.map((member, i) => (
          <motion.div
            key={member.name}
            className="text-center group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="relative w-40 h-40 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-gold/30 group-hover:border-gold transition-colors duration-500" />
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full rounded-full object-cover p-1"
              />
            </div>
            <div className="w-16 h-px bg-gold/40 mx-auto mb-4" />
            <h3 className="font-heading text-lg text-cream mb-1">{member.name}</h3>
            <p className="text-gold text-xs tracking-widest uppercase font-body mb-3">{member.role}</p>
            <p className="text-muted-foreground text-sm leading-relaxed px-2">{member.bio}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TeamSection;
