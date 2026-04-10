import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Data
public class skillRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer requestID;

    private String senderID;
    private String receiverID;
    private String skillID;
    @CreationTimestamp
    private Timestamp requestDate;
    private String message;
    private String status;

    @OneToOne
    @JoinColumn(name="skillID")
    private Skill skill;


    @ManyToOne
    @JoinColumn(name = "senderID")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiverID")
    private User receiver;

}
