import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="UserProfile")
@Data
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer profileId;

    private Integer userId;
    private String LinkdinLink;
    private String githubLink;
    private String bio;
    private String phone;
    private String profileImage;

    @OneToOne
    @JoinColumn(name="userID") //this is the code for the foreign key in java
    private User user;
}
