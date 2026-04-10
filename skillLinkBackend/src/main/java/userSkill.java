import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class userSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userSkillId;

    private Integer userID;
    private Integer skillID;
    private String proficiency;
    private Integer experience;

    @ManyToOne
    @JoinColumn(name="userID")
    private User user;

    @ManyToOne
    @JoinColumn(name="skillID")
    private Skill skill;

}
