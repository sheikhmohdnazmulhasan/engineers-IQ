'use client'

import {
    LightBulbIcon,
    UsersIcon,
    BoltIcon,
    StarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const FeatureCard = ({ title, icon: Icon, description }: { title: string; icon: React.ElementType; description: string }) => (
    <div className="w-full md:max-w-[250px] p-4 shadow-md rounded-lg flex flex-col items-center">
        <Icon className="w-8 h-8 text-blue-600 mb-2" />
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className=" text-center">{description}</p>
    </div>
);

const features = [
    { title: "Expert Advice", icon: LightBulbIcon, description: "Insights from industry professionals." },
    { title: "Community-Driven", icon: UsersIcon, description: "Learn and collaborate with fellow engineers." },
    { title: "Latest Tech News", icon: BoltIcon, description: "Stay updated with cutting-edge technology." },
    { title: "Product Reviews", icon: StarIcon, description: "Make informed decisions on engineering tools." },
    // { title: "Tutorials & Guides", icon: ShareIcon, description: "Step-by-step engineering problem-solving." },
    // { title: "Premium Content", icon: CurrencyDollarIcon, description: "Access exclusive content and courses." },
];

export default function AboutUs() {
    return (
        <div className="py-8">
            <h1 className="text-5xl font-bold text-center">EngineersIQ</h1>
            <h2 className="text-2xl text-center">Transforming Ideas into Code, Together.</h2>

            <div className="my-12" />

            <h2 className="text-3xl font-semibold">Our Mission</h2>
            <div className="space-y-2">
                <p className="">
                    At EngineersIQ, we believe in the transformative power of software engineering to shape the future. Our mission is to create an inclusive, knowledge-rich platform that empowers software engineers of all experience levels to thrive in an ever-evolving digital landscape. We are committed to bridging the gap between emerging technologies and real-world application, offering our community the tools, resources, and collaborative spaces they need to excel.
                </p>
                <p className="">
                    Through expert-led content, up-to-date industry insights, and peer-to-peer learning, we aim to foster a culture of continuous growth, innovation, and collaboration. Whether you&apos;re just starting your coding journey or are a seasoned professional looking to stay on top of the latest trends, EngineersIQ is here to provide the guidance, support, and connections you need to succeed.
                </p>
                <p className="">
                    We envision a future where every software engineer has the knowledge, confidence, and resources to solve complex problems, build groundbreaking software, and contribute meaningfully to the tech industry. By focusing on practical, hands-on learning and community-driven growth, we seek to cultivate the next generation of software leaders and innovators.
                </p>
            </div>

            <div className="my-12" />

            <h2 className="text-3xl font-semibold">Our Community</h2>
            <p className="">
                EngineersIQ is more than just a platform; it&apos;s a thriving community of engineers, professionals, and curious learners.
                Our diverse user base contributes to a rich ecosystem of knowledge, where everyone has something to learn and something to teach.
            </p>
            <p className="mt-4">
                Whether you&apos;re troubleshooting a complex engineering problem, exploring new tools, or diving into
                the world of coding, you&apos;ll find a supportive community ready to help and collaborate.
            </p>

            <div className="my-12" />

            <h2 className="text-3xl font-semibold text-center">What We Offer</h2>
            <div className="flex flex-wrap gap-6 mt-6 justify-center">
                {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                ))}
            </div>


            <div className="my-12" />

            <div className="text-center">
                <h2 className="text-3xl font-semibold">Join Our Engineering Community</h2>
                <p className="">
                    Ready to enhance your engineering knowledge and connect with like-minded enthusiasts?
                </p>
                <div className="mt-8">
                    <Link className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300" href={'/auth/register'}>
                        Sign Up Now
                    </Link>
                </div>
            </div>

            <div className="my-8" />
        </div>
    );
}
