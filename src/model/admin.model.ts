import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Member full name is required"],
    trim: true,
    maxlength: [100, "Full name cannot exceed 100 characters"],
  },
  gender: {
    type: String,
    required: [true, "Member gender is required"],
    enum: {
      values: ["male", "female", "other"],
      message: "Please select a valid gender",
    },
  },
  mobileNo: {
    type: String,
    required: [true, "Member mobile number is required"],
    trim: true,
    match: [/^\+?[1-9]\d{9,14}$/, "Please enter a valid mobile number in E.164 format (e.g. +12345678901)"],
  },
  email: {
    type: String,
    required: [true, "Member email is required"],
    trim: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email",
    ],
  },
}, { _id: false });

const DriveFileSchema = new mongoose.Schema({
  fileUrl: {
    type: String,
    required: true,
    match: [
      /^https:\/\/res\.cloudinary\.com\/[\w-]+\/.+\/.+$/,
      "Please provide a valid Cloudinary file URL"
    ],
  }
}, { _id: false });

const TeamRegistrationSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      unique: true,
      maxlength: [100, "Team name cannot exceed 100 characters"],
      index: true,
    },

    leaderName: {
      type: String,
      required: [true, "Team leader name is required"],
      trim: true,
      maxlength: [100, "Leader name cannot exceed 100 characters"],
    },

    leaderEmail: {
      type: String,
      required: [true, "Team leader email is required"],
      trim: true,
      lowercase: true,
      index: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid leader email",
      ],
    },

    leaderMobile: {
      type: String,
      required: [true, "Leader mobile number is required"],
      trim: true,
  match: [/^\+?[0-9]\d{9,14}$/, "Please enter a valid leader mobile number (10-15 digits, may start with 0 or +)"],
    },

    leaderGender: {
      type: String,
      required: [true, "Leader gender is required"],
      enum: {
        values: ["male", "female", "other"],
        message: "Please select a valid gender",
      },
    },

    institution: {
      type: String,
      required: [true, "Institution name is required"],
      trim: true,
      maxlength: [200, "Institution name cannot exceed 200 characters"],
      index: true,
    },

    program: {
      type: String,
      required: [true, "Program is required"],
      enum: {
        values: [
          "B.Tech - Computer Engineering",
          "B.Tech - Information Technology",
          "B.Tech - Electronics & Telecommunication",
          "B.Tech - Mechanical Engineering",
          "B.Tech - Civil Engineering",
          "B.Tech - Electrical Engineering",
          "M.Tech - Computer Engineering",
          "M.Tech - Information Technology",
          "M.Tech - Electronics & Telecommunication",
          "MCA - Master of Computer Applications",
          "MBA - Master of Business Administration",
          "Other"
        ],
        message: "Please select a valid program",
      },
    },

    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      maxlength: [100, "Country name cannot exceed 100 characters"],
    },

    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      maxlength: [100, "State name cannot exceed 100 characters"],
    },

    members: {
      type: [TeamMemberSchema],
      validate: {
        validator: function(members: any[]) {
          const validMembers = members.filter(member => 
            member.fullName && member.fullName.trim() !== ""
          );
          return validMembers.length >= 1 && validMembers.length <= 4;
        },
        message: "Team must have between 1-4 members (excluding leader)",
      },
    },

    mentorName: {
      type: String,
      required: [true, "Mentor name is required"],
      trim: true,
      maxlength: [100, "Mentor name cannot exceed 100 characters"],
    },

    mentorEmail: {
      type: String,
      required: [true, "Mentor email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid mentor email",
      ],
    },

    mentorMobile: {
      type: String,
      required: [true, "Mentor mobile number is required"],
      trim: true,
  match: [/^\+?[0-9]\d{9,14}$/, "Please enter a valid mentor mobile number (10-15 digits, may start with 0 or +)"],
    },

    mentorInstitution: {
      type: String,
      required: [true, "Mentor institution is required"],
      trim: true,
      maxlength: [200, "Mentor institution cannot exceed 200 characters"],
    },

    mentorDesignation: {
      type: String,
      required: [true, "Mentor designation is required"],
      trim: true,
      maxlength: [100, "Mentor designation cannot exceed 100 characters"],
    },

    instituteNOC: {
      type: DriveFileSchema,
      required: false,
    },

    idCardsPDF: {
      type: DriveFileSchema,
    },

    topicName: {
      type: String,
      required: [true, "Topic name is required"],
      trim: true,
      maxlength: [200, "Topic name cannot exceed 200 characters"],
    },

    topicDescription: {
      type: String,
      required: [true, "Topic description is required"],
      trim: true,
    },

    track: {
      type: String,
      required: [true, "Track selection is required"],
      enum: {
        values: [
          "Climate Forecasting",
          "Smart Agriculture",
          "Disaster Management",
          "Green Transportation",
          "Energy Optimization",
          "Water Conservation",
          "Carbon Tracking",
          "Biodiversity Monitoring",
          "Sustainable Cities",
          "Waste Management",
          "Air Quality",
          "Deforestation Prevention",
          "Climate Education",
          "AI-based Environmental Data Analysis",
          "Public Health Impact of Climate Change",
          "Ocean & Marine Protection using AI"
        ],
        message: "Please select a valid track",
      },
      index: true,
    },

    presentationPPT: {
      type: DriveFileSchema,
      required: [true, "Presentation PPT Cloudinary link is required"],
    },

    registrationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    registrationNumber: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    teamId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    approvedAt: {
      type: Date,
    },

    rejectedAt: {
      type: Date,
    },

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: [500, "Rejection reason cannot exceed 500 characters"],
    },

    actionedBy: {
      type: String,
      trim: true,
      maxlength: [100, "Actioned by cannot exceed 100 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for total team size (including leader)
TeamRegistrationSchema.virtual('teamSize').get(function() {
  const validMembers = this.members.filter((member: any) => 
    member.fullName && member.fullName.trim() !== ""
  );
  return validMembers.length + 1; // +1 for leader
});

// Virtual for formatted registration number
TeamRegistrationSchema.virtual('formattedRegNumber').get(function() {
  if (this.registrationNumber) {
    return this.registrationNumber;
  }
  return null;
});

// Pre-save middleware to generate registration number for new teams
TeamRegistrationSchema.pre('save', async function(next) {
  if (this.isNew && !this.registrationNumber) {
    try {
      const count = await (this.constructor as mongoose.Model<any>).countDocuments({});
      this.registrationNumber = `PCCOEIGC${String(count + 1).padStart(3, '0')}`;
    } catch (error) {
      return next(error as Error);
    }
  }
  if (this.isNew && !this.teamId) {
    try {
      const count = await (this.constructor as mongoose.Model<any>).countDocuments({});
      this.teamId = `IGC${String(count + 1).padStart(3, '0')}`;
    } catch (error) {
      return next(error as Error);
    }
  }
  if (this.registrationStatus === 'approved' && !this.approvedAt) {
    this.approvedAt = new Date();
  }
  if (this.registrationStatus === 'rejected' && !this.rejectedAt) {
    this.rejectedAt = new Date();
  }
  next();
});

// Compound indexes for common query patterns
TeamRegistrationSchema.index({ registrationStatus: 1, submittedAt: -1 }); // Admin dashboard sorting
TeamRegistrationSchema.index({ institution: 1, registrationStatus: 1 }); // Institution-based filtering
TeamRegistrationSchema.index({ track: 1, registrationStatus: 1 }); // Track-based filtering
TeamRegistrationSchema.index({ 'members.email': 1 }); // Member email searches
TeamRegistrationSchema.index({ country: 1, state: 1 }); // Geographic reports
TeamRegistrationSchema.index({ program: 1, institution: 1 }); // Institutional reports

// Static method to find teams by track
TeamRegistrationSchema.statics.findByTrack = function(track: string) {
  return this.find({ track: track });
};

// Static method to get approved teams count
TeamRegistrationSchema.statics.getApprovedCount = function() {
  return this.countDocuments({ registrationStatus: 'approved' });
};

// Static method to get teams with pagination and filtering
TeamRegistrationSchema.statics.getTeamsPaginated = function(
  page: number = 1, 
  limit: number = 50, 
  filters: any = {}
) {
  const skip = (page - 1) * limit;
  return this.find(filters)
    .select({
      teamName: 1,
      leaderName: 1,
      leaderEmail: 1,
      institution: 1,
      track: 1,
      registrationStatus: 1,
      registrationNumber: 1,
      submittedAt: 1,
      teamSize: 1
    })
    .sort({ submittedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

// Instance method to approve team
TeamRegistrationSchema.methods.approve = function(actionedBy: string) {
  this.registrationStatus = 'approved';
  this.approvedAt = new Date();
  this.actionedBy = actionedBy;
  return this.save();
};

// Instance method to reject team
TeamRegistrationSchema.methods.reject = function(reason: string, actionedBy: string) {
  this.registrationStatus = 'rejected';
  this.rejectionReason = reason;
  this.rejectedAt = new Date();
  this.actionedBy = actionedBy;
  return this.save();
};

export default mongoose.model('TeamRegistration', TeamRegistrationSchema);