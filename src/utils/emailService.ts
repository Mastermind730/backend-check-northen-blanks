import dotenv from 'dotenv';
dotenv.config();
const HACKATHON_NAME = "Indradhanu: PCCOE International Grand Challenge 2025";
const HACKATHON_STAGE = "1";
const ORGANIZER_NAME = "IR Cell PCCoE,Pune";
const ORGANIZER_POSITION = "Convener, Indradhanu 2025";
const ORGANIZER_INSTITUTE = "Pimpri Chinchwad College of Engineering (PCCOE)";
const ORGANIZER_CONTACT = "pccoeigchack@pccoepune.org";

import mailjet from 'node-mailjet';

const mailjetClient = mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC!,
  process.env.MJ_APIKEY_PRIVATE!
);

export const sendAcceptanceEmail = async (to: string, teamID: string,) => {
  try {
    await mailjetClient
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.MJ_FROM_EMAIL!,
              Name: "PCCOE IGC",
            },
            To: [
              {
                Email: to,
              },
            ],
            Subject: 'Selection for Round 2 - Indradhanu: PCCOE International Grand Challenge 2025',
            HTMLPart: `
              <div style="font-family: Arial, sans-serif; padding: 20px;">
                  <h2>Selection for Round 2 - Indradhanu: PCCOE International Grand Challenge 2025</h2>
                  <p>Dear Team Leader and Team Members,</p>
                  <p>Greetings from the PCCOE International Grand Challenge Team!</p>
                  <h3>Congratulations!</h3>
                  <p>We are pleased to inform you that your team, <strong>Registration ID: ${teamID}</strong>, has been selected for the second round of the Indradhanu: PCCOE International Grand Challenge 2025.</p>
                  <p>As part of this phase, you are required to:</p>
                  <ul>
                      <li>Upload a video of your working prototype or functional idea on YouTube</li>
                      <li>Submit the YouTube video link using the following submission form: <a href="https://pccoe-igc.vercel.app/submit-video">https://pccoe-igc.vercel.app/submit-video</a></li>
                  </ul>
                  <p><strong>Video Submission Window:</strong> September 16 - November 15, 2025</p>
                  <p>Please ensure your video is submitted within this period and adheres to the provided guidelines.</p>
                  <p>For the detailed event timeline, rules, and updates, kindly refer to the official website:<br/>
                  <a href="https://pccoe-igc.vercel.app/timeline">https://pccoe-igc.vercel.app/timeline</a></p>
                  <p>We look forward to witnessing your creativity and innovation in the next round!</p>
                  <br/>
                  <p>Warm regards,</p>
                  <p>Team Indradhanu 2025<br/>
                  Pimpri Chinchwad College of Engineering (PCCOE)</p>
              </div>
            `,
          },
        ],
      });
    console.log(`[EMAIL LOG] Acceptance email sent to: ${to} `);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendRejectionEmail = async (to: string, teamName: string) => {
  try {
    await mailjetClient
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.EMAIL_USER!,
              Name: "PCCOE IGC",
            },
            To: [
              {
                Email: to,
              },
            ],
            Subject: `Hackathon Selection Update - ${HACKATHON_NAME}`,
            HTMLPart: `
              <div style="font-family: Arial, sans-serif; padding: 20px;">
                  <h2>Hackathon Selection Update - ${HACKATHON_NAME}</h2>
                  <p>Dear <strong>${teamName}</strong> Team,</p>
                  <p>Thank you for participating in <strong>${HACKATHON_NAME}</strong> and for the time, effort, and creativity you invested in your submission for Stage ${HACKATHON_STAGE}.</p>
                  <p>After careful evaluation by our panel members, we regret to inform you that your team has not been selected to proceed to the next stage of the hackathon.</p>
                  <p>We truly appreciate your contribution and enthusiasm. Your ideas and efforts have been commendable, and we encourage you to continue exploring and refining your project. Innovation is a journey, and we hope this experience adds value to your future endeavors.</p>
                  <p>We look forward to seeing your participation in our future events.</p>
                  <br/>
                  <p>Best regards,</p>
                  <p>${ORGANIZER_NAME}<br/>
                  ${ORGANIZER_POSITION}<br/>
                  ${ORGANIZER_INSTITUTE}<br/>
                  ${ORGANIZER_CONTACT}</p>
              </div>
            `,
          },
        ],
      });
    console.log(`[EMAIL LOG] Rejection email sent to: ${to}`);
    return true;
  } catch (error) {
    console.error('Error sending rejection email:', error);
    return false;
  }
};