'use client'
import Image from 'next/image';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';

// Define social media links configuration
const SOCIAL_MEDIA_LINKS = {
  column1: [
    { 
      icon: TwitterIcon, 
      text: 'twitter.com/IBT1917',
      color: 'black' 
    },
    { 
      icon: EmailIcon, 
      text: 'ibt@bolshevik.org',
      color: 'black' 
    }
  ],
  column2: [
    { 
      icon: FacebookIcon, 
      text: 'facebook.com/Bolsheviks',
      color: 'black' 
    },
    { 
      icon: YouTubeIcon, 
      text: 'youtube.com/user/ibt1917',
      color: 'black' 
    }
  ]
} as const;

interface PrintLayoutProps {
  slug?: string;
}

const PrintLayout = ({ slug }: PrintLayoutProps) => {
  return (
    <div className="hidden print:block print:mt-4 print:w-full print:px-4 text-center">
      {/* Full-width Title */}
      <div className="mb-8 text-left">
        {/* Title */}
        <span className="print:text-2xl font-telegrafico underline font-semibold mb-2 text-black block">
          International Bolshevik Tendency
        </span>
        {/* Full-width URL */}
        <span className="print:text-2xl font-telegrafico font-medium text-black block">
          {slug
            ? `https://bolshevik.org/article/${slug}/`
            : 'https://bolshevik.org/'}
        </span>
      </div>

      {/* Banner and Social Media Links */}
      <div className="grid print:grid-cols-[20%_40%_40%] items-center">
        {/* Banner */}
        <div className="flex justify-start">
        <img
  src="https://backend.saggitari.us/wp-content/uploads/2024/10/file.png"
  alt="Banner for Print"
  width="127"
  height="127"
  className="rounded-full"
/>
        </div>

        {/* First Social Media Column */}
        <div className="flex flex-col gap-2 text-black justify-center">
          {SOCIAL_MEDIA_LINKS.column1.map((item, index) => (
            <div key={index} className="flex items-center">
              <item.icon 
                className="mr-2 print:w-7 print:h-7" 
                style={{ color: item.color }} 
              />
              <span className="print:text-lg font-semibold">
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Second Social Media Column */}
        <div className="flex flex-col gap-2 text-black justify-center">
          {SOCIAL_MEDIA_LINKS.column2.map((item, index) => (
            <div key={index} className="flex items-center">
              <item.icon 
                className="mr-2 print:w-7 print:h-7" 
                style={{ color: item.color }} 
              />
              <span className="print:text-lg font-semibold">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrintLayout;
